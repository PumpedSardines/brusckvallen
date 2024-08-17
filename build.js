const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const sass = require("sass");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlMinify = require("html-minifier-terser").minify;

const minify = {
  css: (css) => new CleanCSS({}).minify(css).styles,
  js: (js) => UglifyJS.minify(js, { toplevel: true }).code,
  html: (html) =>
    htmlMinify(html, {
      collapseWhitespace: true,
      removeComments: true,
    }),
};
const loaders = {
  file: (path) => {
    return async () => await fs.promises.readFile(path, "utf-8");
  },
  scss: (path) => {
    return async () => (await sass.compileAsync(path)).css.toString();
  },
};

const root = path.resolve(__dirname, "src");
const out = path.resolve(__dirname, "dist");

const paths = {
  scripts: {
    "vendor.js": async () => {
      const js = loaders.file(path.join(root, "js/vendor.js"));

      return minify.js(await js());
    },
    "default.js": async () => {
      const js = loaders.file(path.join(root, "js/default.js"));

      return minify.js(await js());
    }
  },
  styles: {
    "default.css": async () => {
      const css = loaders.scss(path.join(root, "styles/default.scss"));

      return minify.css(await css());
    },
    "home.css": async () => {
      const css = loaders.scss(path.join(root, "styles/pages/home/index.scss"));

      return minify.css(await css());
    },
  },
  "home.html": async () => {
    const output = await ejs.renderFile(
      path.join(root, "html/pages/home/index.html"),
      {},
      { async: true },
    );

    return minify.html(output);
  },
};

async function build(folder, paths) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  for (const [file, type] of Object.entries(paths)) {
    if (typeof type === "function") {
      const content = await type();

      if (typeof content === "string" || content instanceof Buffer) {
        fs.writeFileSync(path.join(folder, file), content);
      } else {
        throw new Error(
          `Invalid content type: ${typeof content}, for file ${path.join(
            folder,
            file,
          )}`,
        );
      }
    } else {
      await build(path.join(folder, file), type);
    }
  }
}

build(out, paths).catch((err) => {
  console.error(err);
  process.exit(1);
});
