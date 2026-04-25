import { ComponentPropsWithoutRef } from "react";
import { compileMDX } from "next-mdx-remote/rsc";

interface MdxRendererProps {
  mdxSource: string;
}

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="mt-6 mb-4 pb-2 text-3xl font-semibold tracking-tight border-b border-[#d0d7de] dark:border-[#30363d]"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-6 mb-4 pb-2 text-2xl font-semibold tracking-tight border-b border-[#d0d7de] dark:border-[#30363d]"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-6 mb-4 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="mt-6 mb-4 text-base font-semibold"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className="mb-4 leading-7"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-[#0969da] hover:underline font-medium dark:text-[#58a6ff] decoration-1 underline-offset-4"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mt-0 mb-4 px-4 text-[#57606a] border-l-4 border-[#d0d7de] dark:text-[#8b949e] dark:border-[#30363d]"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mb-4 pl-8 list-disc [&>li]:mt-1"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mb-4 pl-8 list-decimal [&>li]:mt-1"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li
      className="leading-7"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr
      className="h-[0.25em] my-6 bg-[#d0d7de] border-0 dark:bg-[#30363d]"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="w-full text-left border-collapse"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead
      className="bg-[#f6f8fa] dark:bg-[#161b22]"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr
      className="bg-white border-t border-[#d0d7de] dark:bg-transparent dark:border-[#30363d] even:bg-[#f6f8fa] dark:even:bg-[#161b22]"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-3 py-2 border border-[#d0d7de] font-semibold dark:border-[#30363d]"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="px-3 py-2 border border-[#d0d7de] dark:border-[#30363d]"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="p-4 mb-4 overflow-auto text-[85%] leading-normal bg-[#f6f8fa] rounded-md dark:bg-[#161b22]"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => {
    // If the code block is inside a `<pre>` tag, it usually shouldn't have the inline styling
    const isInline = !props.className?.includes("language-");

    return (
      <code
        className={`${isInline ? "px-[0.4em] py-[0.2em] m-0 text-[85%] bg-[#afb8c133] rounded-md dark:bg-[#6e768155]" : ""} font-mono text-sm`}
        {...props}
      />
    );
  },
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="max-w-full h-auto rounded-md box-content border dark:border-[#30363d]"
      {...props}
      alt={props.alt || "MDX Image"}
    />
  ),
};

export default async function MDXRenderer({ mdxSource }: MdxRendererProps) {

  const response = await fetch(mdxSource, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return (
      <div className="rounded-2xl border border-amber-400/35 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-200">
        <h2 className="text-lg font-semibold">Story unavailable</h2>
        <p className="mt-2 text-sm opacity-90">
          `Unable to fetch MDX (${response.status})`
        </p>
      </div>
    );
  }

  const sourceStr = await response.text();

  const { content } = await compileMDX({
    source: sourceStr.replace(/{/g, "\\{").replace(/}/g, "\\}"),
    components
  });

  return <>{content}</>;
}