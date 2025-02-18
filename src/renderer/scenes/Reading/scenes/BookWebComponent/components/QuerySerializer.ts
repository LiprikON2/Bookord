interface CustomNode {
    name: string;
    nthType: number;
    nthChild: number;
    attrs?: { [name: string]: string };
}

/**
 *
 * ref: https://gist.github.com/daniellizik/d72b1c8ac0f335afdd6526a6e5eab7e5#file-path-generator-js-L194
 */
export default class QuerySerializer {
    constants = {
        nthType: ":nth-of-type",
        nthChild: ":nth-child",
    };
    origin: EventTarget;
    originPath: CustomNode[];
    trees: CustomNode[][];
    needle: string;
    dom: Document | ShadowRoot | HTMLElement;
    constructor(dom: Document | ShadowRoot | HTMLElement, origin: EventTarget) {
        /**
         * :nth-of-type is only ie9+ https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-of-type
         * But would we rather have nested query selectors?
         * The former is better for pushing basket items because they will have a common parent element.
         * ex:
         *   document.querySelector('.my-class')[2].querySelector('.some-element')[1]
         *   document.querySelector('.my-class:nth-of-type(2) .some-element:nth-of-type(1)')
         */
        this.dom = dom;
        this.origin = origin;
        this.originPath = this.walkUp(this.origin as HTMLElement);
        this.trees = this.findTrees();
        this.needle = this.diffTreePaths();
    }

    /**
     * Diffs tree paths of this.trees to find which selectors we need to add to this.originPath
     */
    diffTreePaths(curr = 0) {
        const serializedTrees = this.trees.map((tree) => this.stringify(tree));
        // console.log(
        //     "QuerySerializer",
        //     JSON.stringify(serializedTrees, null, 2),
        //     this.dom,
        //     this.origin
        // );

        for (const serializedTree of serializedTrees) {
            const selector = serializedTree.join(" > ");
            const query = [...this.dom.querySelectorAll(selector)];
            const count = query.length;
            if (query[0] === this.origin) return selector;
        }
        console.error("Failed to find a needle for:", this.origin);
    }

    findTrees() {
        const maxPath = this.stringify(this.originPath);
        const minPath = this.maxLeftTrim(this.leftTrimId(maxPath));
        return [].slice
            .call(this.dom.querySelectorAll(minPath.join(" ")))
            .map((node: HTMLElement) => this.walkUp(node));
    }

    /**
     * Takes original target node and walks up tree and collects path
     * @param {dom object} origin - needle in the haystack (dom tree) we start at
     */
    walkUp(origin: HTMLElement, el?: HTMLElement, path: CustomNode[] = []): CustomNode[] {
        const target = el || origin;
        if (target === this.dom) return path;

        const position = this.walkLeft(target);
        const node: CustomNode = {
            name: target.nodeName.toLowerCase(),
            nthType: position.type,
            nthChild: position.child,
        };
        if (target.attributes) {
            if (target.attributes.length > 0) {
                node.attrs = {};
                // @ts-ignore
                [].slice.call(target.attributes).forEach((attr) => {
                    node.attrs[attr.name] = attr.value;
                });
            }
        }
        if (target.parentNode) {
            path.unshift(node);
            // @ts-ignore
            return this.walkUp(origin, target.parentNode, path);
        } else {
            return path;
        }
    }

    /**
     * Takes node and walks left in list of sibling nodes to get nth-type-of and nth-child positions, which starts at 1, not 0.
     * @param {dom object} node
     */
    walkLeft(node: Node) {
        return !node.parentNode
            ? 0
            : [].slice.call(node.parentNode.childNodes || []).reduce(
                  (
                      acc: { hasPosition: boolean; position: { child: number; type: number } },
                      el: ChildNode
                  ) => {
                      if (el === node) {
                          acc.hasPosition = true;
                      }
                      if (acc.hasPosition === false) {
                          acc.position.child++;
                          if (el.nodeName === node.nodeName) {
                              acc.position.type++;
                          }
                      }
                      return acc;
                  },
                  { position: { type: 1, child: 1 }, hasPosition: false }
              ).position;
    }

    /**
     * Takes query selector array path and left trims to the last #id selector
     * @param {array} path - array of selector strings
     *
     * ['.foo', '.bar', '.fizz', '.buzz', '#id', '.blah']
     * => ['#id', '.blah']
     */
    leftTrimId(path: string[]) {
        return path
            .reverse()
            .reduce((acc, item) => {
                if (acc.join(" ").indexOf("#") < 0) {
                    acc.push(item);
                }
                return acc;
            }, [])
            .reverse();
    }

    /**
     * Takes query selector path array and recursively left trims it until the original node is found
     * @param {array} path - not a collection, just array of strings
     *
     * 1st iteration: ['.fizz' '.foo', '.bar'];
     * next iteration: ['.foo', '.bar'];
     * next iteration: ['.bar'];
     * etc...
     */
    maxLeftTrim(path: string[], origin: Element = null, trim = 0, previous?: string[]): string[] {
        console.log("origin", origin, path.join(" "));
        if (origin === null) origin = this.dom.querySelector(path.join(" "));

        const branch = path.slice(trim);
        const selector = branch.join(" ");
        if (branch.length === 1) {
            return branch;
        }
        if (branch.length === 0) {
            return ["body"];
        }

        const target = this.dom.querySelector(selector);
        if (origin === target) {
            return this.maxLeftTrim(path, origin, trim + 1, branch);
        } else if (origin !== target || target === null) {
            return previous;
        }
    }

    /**
     * Takes collection of nodes and returns concatenated strings
     * @param {array} path
     * @property {string} name - node name
     * @property {object} attrs - html attributes, each key/value is a string
     * [
     *   {
     *     name: 'div',
     *     attrs: {
     *       id: 'blah',
     *       class: 'foo bar what'
     *     }
     *   },
     *   {
     *     name: 'p',
     *     nthChild: 5
     *   }
     *  ]
     *
     * ... => ['#blah', 'p:nth-child(5)']
     *
     */
    stringify(path: CustomNode[]) {
        return path.map((node) => {
            const name = node.name;
            const nthType = node.nthType < 2 ? "" : `${this.constants.nthType}(${node.nthType})`;
            const nthChild =
                node.nthChild < 2 ? "" : `${this.constants.nthChild}(${node.nthChild})`;
            let id;
            let classlist;
            const blank = /^\s+$/;
            const spaces = /\s{2,}/g;
            let selector = "";
            if (node.attrs && false) {
                if (node.attrs.id) {
                    id = "#" + node.attrs.id.trim();
                }
                if (node.attrs.class) {
                    classlist =
                        "." +
                        node.attrs.class.trim().replace(spaces, " ").split(" ").join(".").trim();
                }
            }
            // if there is no attrs we need to include nodename
            if ((blank.test(id) && blank.test(classlist)) || (!id && !classlist)) {
                selector = name + nthType;
            }
            // if there is an id you we don't need anything else
            else if (id) {
                selector = id;
            }
            // if no id, take nodename and classlist
            else if (!id && classlist) {
                selector = name + classlist + nthType;
            }
            return selector;
        });
    }
}
