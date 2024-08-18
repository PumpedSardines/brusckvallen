const fs = require("fs");
const seedrandom = require("seedrandom");
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
    },
    "home.js": async () => {
      const js = loaders.file(path.join(root, "js/pages/home.js"));

      return minify.js(await js());
    },
  },
  styles: {
    "default.css": async () => {
      const css = loaders.scss(path.join(root, "styles/default.scss"));

      return minify.css(await css());
    },
    "fonts.css": async () => {
      const css = loaders.scss(path.join(root, "styles/fonts.scss"));

      return minify.css(await css());
    },
    "home.css": async () => {
      const css = loaders.scss(path.join(root, "styles/pages/home/index.scss"));

      return minify.css(await css());
    },
  },
  "home.html": async () => {
    const output = await ejs.renderFile(
      path.join(root, "html/pages/home/index.ejs"),
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

function randomString(seed, length = 6) {
  const rng = seedrandom(seed);
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(rng() * chars.length)];
  }
  return result;
}

(async () => {
  await build(out, paths).catch((err) => {
    console.error(err);
    process.exit(1);
  });
  return;

  const stylesFiles = fs.readdirSync(path.join(out, "styles"));
  const htmlFiles = fs
    .readdirSync(path.join(out))
    .filter((file) => file.endsWith(".html"));

  const variables = new Map();
  const taken = new Set();
  for (const file of stylesFiles) {
    const content = fs.readFileSync(path.join(out, "styles", file), "utf-8");
    content.match(/\.([a-zA-Z__-][a-zA-Z0-9__-]*)/g).forEach((match) => {
      const rawName = match.slice(1);

      if (variables.has(rawName)) {
        return;
      }

      const classNameLength = 4;

      let name = randomString(rawName, classNameLength);
      while (taken.has(name)) {
        name = randomString(name, classNameLength);
      }
      taken.add(name);
      variables.set(rawName, name);
    });
  }

  const variablesSorted = Array.from(variables.entries()).sort(
    ([a], [b]) => b.length - a.length,
  );

  for (const style of stylesFiles) {
    let content = fs.readFileSync(path.join(out, "styles", style), "utf-8");

    for (const [rawName, name] of variablesSorted) {
      content = content.replace(new RegExp(rawName, "g"), `${name}`);
    }

    fs.writeFileSync(path.join(out, "styles", style), content);
  }

  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(path.join(out, htmlFile), "utf-8");

    for (const [rawName, name] of variablesSorted) {
      content = content.replace(new RegExp(rawName, "g"), `${name}`);
    }

    fs.writeFileSync(path.join(out, htmlFile), content);
  }
})();
