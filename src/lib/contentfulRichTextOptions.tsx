import type { Options } from "@contentful/rich-text-react-renderer";
import { INLINES } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

const hasRenderableChildren = (children: ReactNode) => {
    if (Array.isArray(children)) {
        return children.some(
        (child) => child !== null && child !== undefined && child !== "",
        );
    }

    return children !== null && children !== undefined && children !== "";
};

const fallbackLabelFromFields = (fields: Record<string, unknown>) => {
    const candidates = [
        fields.linkText,
        fields.text,
        fields.titlu,
        fields.title,
        fields.numeServiciu,
        fields.denumireArticol,
        fields.nume,
    ];

    const match = candidates.find(
        (value) => typeof value === "string" && value.trim().length > 0,
    ) as string | undefined;

    return match ?? "Detalii";
};

const resolveEntryHref = (fields: Record<string, unknown>) => {
    const slug = fields.slug;
    if (typeof slug === "string" && slug.trim()) {
        return `/blog/${slug}`;
    }

    return "#services";
};

export const contentfulRichTextOptions: Options = {
    renderNode: {
        [INLINES.ENTRY_HYPERLINK]: (node, children) => {
            const target = (node.data as { target?: { fields?: Record<string, unknown> } })
                ?.target;
            const fields = target?.fields ?? {};
            const label = hasRenderableChildren(children)
                ? children
                : fallbackLabelFromFields(fields);

            return (
                <a
                    href={resolveEntryHref(fields)}
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                    {label}
                </a>
            );
        },
    },
};
