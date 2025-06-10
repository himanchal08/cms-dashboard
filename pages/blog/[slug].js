import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function getStaticPaths() {
  const files = fs.readdirSync("content/posts");
  const paths = files.map((file) => ({
    params: { slug: file.replace(".md", "") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const markdown = fs.readFileSync(`content/posts/${params.slug}.md`, "utf-8");
  const { data, content } = matter(markdown);
  const processed = await remark().use(html).process(content);

  return {
    props: {
      frontmatter: {
        ...data,
        date: data.date.toString(), // ✅ this is the fix
      },
      content: processed.toString(),
    },
  };
}

export default function BlogPost({ frontmatter, content }) {
  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <p>{frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
