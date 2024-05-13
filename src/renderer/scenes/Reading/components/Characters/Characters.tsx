import React from "react";
import { observer } from "mobx-react-lite";
import { Stack, Button } from "@mantine/core";

import { useBookReadStore } from "~/renderer/stores";
import { Character } from "./components";

interface CharactersProps {
    //
}

export const Characters = observer(({}: CharactersProps) => {
    const bookReadStore = useBookReadStore();

    const buttonVisible =
        !bookReadStore.isSectionAnalysisRequested() ||
        (bookReadStore.isSectionAnalysisRequested() && !bookReadStore.isSectionAnalysisReady());
    const buttonLoading = bookReadStore.isSectionAnalysisRequested();

    return (
        <Stack pl="sm">
            {buttonVisible && (
                <Button
                    variant="light"
                    onClick={() => bookReadStore.requestTextAnalysis()}
                    loading={buttonLoading}
                    loaderProps={{ type: "dots" }}
                >
                    Analyse chapter
                </Button>
            )}

            {bookReadStore.getPeople().map((person) => (
                <Character key={person.uniqueName} person={person} />
            ))}
        </Stack>
    );
});
