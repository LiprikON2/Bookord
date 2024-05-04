import React from "react";
import { Flex, Stack, Title, Text, type MantineSize, TitleProps } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

interface DetailedTitleProps {
    getTitle: () => string;
    description?: string;
    Icon?: Icon;
    size?: MantineSize;
}

const sizeObj = {
    xs: {
        Title: {
            order: 5,
            size: "h6",
            fw: 700,
        },
    },
    sm: {
        Title: {
            order: 4,
            size: "h5",
            fw: 700,
        },
    },
    md: {
        Title: {
            order: 3,
            size: "h4",
            fw: 700,
        },
    },
    lg: {
        Title: {
            order: 2,
            size: "h3",
            fw: 700,
        },
    },
    xl: {
        Title: {
            order: 1,
            size: "h2",
            fw: 700,
        },
    },
};

export const DetailedTitle = observer(
    ({ getTitle, description, Icon, size = "md" }: DetailedTitleProps) => {
        const titleProps = sizeObj[size].Title as TitleProps;

        return (
            <Flex justify="flex-start" align="center" gap="sm">
                {Icon && <Icon />}
                <Stack justify="center" gap={0}>
                    <Title {...titleProps}>{getTitle()}</Title>
                    {description && <Text c="dimmed">{description}</Text>}
                </Stack>
            </Flex>
        );
    }
);
