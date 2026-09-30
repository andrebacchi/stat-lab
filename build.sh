#!/bin/sh
# Gera o index.html do STAT LAB a partir de src/.
# Uso: sh build.sh   (depois aumente VERSION no sw.js antes de publicar)
set -e
cd "$(dirname "$0")"
{
cat src/head.html
echo '<link rel="preconnect" href="https://fonts.googleapis.com">'
echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">'
echo '<style>'; cat src/style.css; echo '</style>'
cat src/body.html
echo '<script>'
for f in lib ui lab-var lab-desc lab-normal lab-prob lab-bench lab-tcl lab-ic lab-hip lab-guide tests-data tests-defs tests-grid tests-ui lab-mult-rel learn main; do cat src/$f.js; echo; done
echo '</script>'
echo '<script>if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}</script>'
echo '</body>'
echo '</html>'
} > index.html.new
mv index.html.new index.html
wc -c index.html
