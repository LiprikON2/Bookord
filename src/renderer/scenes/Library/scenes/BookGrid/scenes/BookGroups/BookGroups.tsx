import React, { useState } from "react";
import { SimpleGrid } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { AnimatePresence } from "framer-motion";

import { BookMetadata, ViewItemGroup } from "~/renderer/stores";
import { BookCard } from "./scenes";

interface BookGroupsProps {
    getBookGroups: () => ViewItemGroup<BookMetadata>[];
}

// TODO refactor into a BookGroup component https://mobx.js.org/react-optimizations.html#render-lists-in-dedicated-components
export const BookGroups = observer(({ getBookGroups }: BookGroupsProps) => {
    const [selectedBookKey, setSelectedBookKey] = useState<string>(null);

    return (
        <>
            {getBookGroups().map((bookGroup) => (
                <SimpleGrid
                    key={bookGroup.name}
                    spacing={{
                        base: "calc(var(--mantine-spacing-xl) * 1.5)",
                        xs: "calc(var(--mantine-spacing-xl) * 1.5)",
                        sm: "xl",
                        md: "calc(var(--mantine-spacing-xl) * 1.5)",
                        lg: "calc(var(--mantine-spacing-xl) * 1.5)",
                        xl: "calc(var(--mantine-spacing-xl) * 1.5)",
                    }}
                    verticalSpacing="xl"
                    cols={{ base: 2, xs: 2, sm: 3, md: 3, lg: 4, xl: 4 }}
                    style={{ justifyItems: "center" }}
                >
                    <AnimatePresence initial={false}>
                        {bookGroup.items.map((book) => (
                            <BookCard
                                key={book.id}
                                bookKey={book.id}
                                visible={book.visible}
                                onClick={() => setSelectedBookKey(book.id)}
                            />
                        ))}
                    </AnimatePresence>
                </SimpleGrid>
            ))}

            {/* <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <AnimatePresence>
                    {selectedBookKey && (
                        <BookCard
                            bookKey={selectedBookKey}
                            onClick={() => setSelectedBookKey(null)}
                            scale={1.5}
                        />
                    )}
                </AnimatePresence>
            </div> */}
        </>
    );
});
