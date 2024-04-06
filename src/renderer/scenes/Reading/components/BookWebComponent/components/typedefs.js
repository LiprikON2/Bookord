/** Book file
 * @typedef {Object} BookFile
 * @property {string} name - Book's filename
 * @property {string} path - Path to the book file
 * @property {string} size - Size of the book file in kilobytes
 */

/** Book metadata information
 * @typedef {Object} Info
 * @property {string} title - Book's title
 * @property {Array<string>} idetifiers - List of book's identifiers (such as a UUID, DOI or ISBN)
 * @property {Array<string>} languages - List of language codes that correspond to languages used in the book
 * @property {Array<string>} relations - List of book's relations
 * @property {Array<string>} subjects - List of book's genres
 * @property {Array<string>} publishers - List of book's publishers
 * @property {Array<string>} contributors - List of book's contributors
 * @property {Array<string>} coverages - List of book's coverage information
 * @property {Array<string>} rights - List of book's copyright information
 * @property {Array<string>} sources - List of book's sources
 * @property {string} description - Book's description
 * @property {string} date - Book's publication date (ISO8601)
 * @property {string} cover - Base64-encoded cover image
 * @property {string} author - Author (creator) of the book
 */

/** Dictionary of books which contains information about book file and book metadata.
 * Book filename is used as a key
 * @typedef {Object} AllBooks
 * @property {Book} BookFile.name - Name of the book file, used as a key to the book entry
 */

/** An entry of AllBooks object; contains information about book file and book metadata
 * @typedef {Object} Book
 * @property {BookFile} bookFile - Book file
 * @property {Info} info - Book metadata
 */

/** List of recently visited (and parsed) books, 0th is last opened book
 * @typedef {ParsedBook[]} RecentBooks
 */

/** Book object which contains parsed sections
 * @typedef {Object} ParsedBook
 * @property {Info} info - Book metadata information
 * @property {Array<HtmlObject>} styles - Book's stylesheets
 * @property {HtmlObject} structure - Book's parsed Table Of Contents (TOC)
 * @property {number} sectionsTotal - Book's total number of section
 * @property {Array<string>} sectionNames - List of section ids (names)
 * @property {number} initSectionIndex - Number that corresponds the book's initally parsed section
 * @property {Array<HtmlObject>} initSection - Initially parsed book section
 * @property {Array<HtmlObject>} sections - Sections
 * @property {string} name - Book's filename
 */

/** Book with only one section parsed, used while the rest of the book is being parsed
 * @typedef {Object} InitBook
 * @property {Info} info - Book metadata information
 * @property {Array<HtmlObject>} styles - Book's stylesheets
 * @property {HtmlObject} structure - Book's parsed Table Of Contents (TOC)
 * @property {number} sectionsTotal - Book's total number of section
 * @property {Array<string>} sectionNames - List of section ids (names)
 * @property {number} initSectionIndex - Number that corresponds the book's initally parsed section
 * @property {Array<HtmlObject>} initSection - Initially parsed book section
 * @property {string} name - Book's filename
 */

/** Dictionary of books' bookmarks. Book filename is used as a key to a specific book's bookmark list
 * @typedef {Object} Bookmarks
 * @property {BookmarkList} BookFile.name
 */

/** List of all of the bookmarks a particular book has
 * @typedef {Bookmark[]} BookmarkList
 */

/** A bookmark, used to indicate a specific part of the specific section of the book
 * @typedef {Object} Bookmark
 * @property {number} sectionIndex - Index of the book's section
 * @property {number} elementIndex - Index of descendant elements of contentElem, which is used to mark a specific part of a section
 */

/** HTML & XML parsed to the JavaScript object
 * @typedef {Array<Object>} HtmlObject
 * @property {string|undefined} [name]
 * @property {string|undefined} [text]
 * @property {Attrs|undefined} [attrs]
 * @property {string|undefined} [sectionId]
 * @property {string|undefined} [href]
 * @property {string|undefined} [_data] - HTML content as a string
 * @property {string|undefined} [tag] - HTML tag
 * @property {number|undefined} [type] - Value of 3 corresponds to the text node
 * @property {HtmlObject|undefined} [children]
 */

/** HtmlObject's Attributes
 * @typedef {Object} Attrs
 * @property {string|undefined} [id]
 * @property {string|undefined} [href]
 * @property {string|undefined} [src]
 *
 */

/** Book state for the purposes of displaying
 * @typedef {Object} UIState
 * @property {string} bookTitle
 * @property {string} currentSectionTitle
 * @property {number} currentSectionPage
 * @property {number} totalSectionPages
 * @property {number} currentBookPage
 * @property {number} totalBookPages
 *
 */
