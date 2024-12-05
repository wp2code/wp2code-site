const { exec } = require("child_process");
const browserSync = require("browser-sync").create();
const gulp = require("gulp");
// const concat = require('gulp-concat');
const gutil = require("gulp-util");

const siteRoot = "_site";

function stoutJekyllLog(jekyll) {
  const jekyllLogger = (buffer) => {
    buffer = buffer.toString();
    buffer = buffer.split(/\n/);
    buffer.forEach(function (message) {
      if (message != "") {
        gutil.log("Jekyll: " + message);
      }
    });
  };
  jekyll.stdout.on("data", jekyllLogger);
  jekyll.stderr.on("data", jekyllLogger);
}
function buildWeb() {
  const jekyll = exec("bundle exec jekyll build --watch --force_polling");
  stoutJekyllLog(jekyll);
}
function startWeb() {
  browserSync.init({
    files: [siteRoot + "/**"],
    port: 1027,
    open: false,
    server: {
      baseDir: siteRoot
    }
  });
}
function startWebWithJekyll() {
  const jekyll = exec("bundle exec jekyll serve --livereload --force_polling");
  stoutJekyllLog(jekyll);
}
gulp.task("jekyll", () => {
  buildWeb();
});
gulp.task("run", () => {
  startWebWithJekyll();
});
gulp.task("serve", () => {
  startWeb();
});
gulp.task("build", gulp.parallel("jekyll", "serve"));
exports.default = startWebWithJekyll;
