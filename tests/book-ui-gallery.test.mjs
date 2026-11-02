import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {GALLERY_COPY,GALLERY_SCREENS,galleryChapter,gallerySection} from '../dist/shared/book-ui-gallery.js';
import {LANGS} from '../dist/shared/locale.js';

test('all book languages describe every captured screen and its actual language',()=>{
 assert.deepEqual(Object.keys(GALLERY_COPY).sort(),Object.keys(LANGS).sort());
 for(const [lang,c] of Object.entries(GALLERY_COPY)){
  assert.deepEqual(Object.keys(c),Object.keys(GALLERY_COPY.ko));
  assert.equal(c.roles.length,3);assert.equal(c.summaries.length,3);
  assert.equal(c.screens.length,GALLERY_SCREENS.length);
  assert(c.screens.every(row=>row.length===2&&row.every(s=>s.trim())));
  assert(c.note.trim());assert.equal(galleryChapter(lang).id,'ui-gallery');
  const html=gallerySection(lang,7);
  assert.equal((html.match(/data-gallery-open=/g)||[]).length,11);
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
  assert(html.includes('<dialog'));assert(html.includes('aria-describedby="gallery-viewer-caption"'));
  assert(!html.includes('<iframe'));assert(!html.includes('store='));assert(!html.includes('token='));
  assert(html.includes('href="#apps"'));
 }
});
test('published images are small actual screenshot assets and every role has coverage',async()=>{
 assert.equal(new Set(GALLERY_SCREENS.map(s=>s.id)).size,11);
 assert.deepEqual(['guest','owner','staff'].map(role=>GALLERY_SCREENS.filter(s=>s.role===role).length),[4,4,3]);
 let bytes=0;
 for(const screen of GALLERY_SCREENS){
  const path=new URL(`../dist/${screen.src}`,import.meta.url),buffer=await readFile(path);
  assert.equal(buffer.toString('ascii',0,4),'RIFF');assert.equal(buffer.toString('ascii',8,12),'WEBP');
  bytes+=(await stat(path)).size;assert(screen.width>=400&&screen.height>=800);
 }
 assert(bytes<500_000,`Gallery image payload ${bytes} should stay below 500 kB`);
});
test('the gallery is integrated into book navigation, language changes and cleanup',async()=>{
 const book=await readFile(new URL('../dist/book.js',import.meta.url),'utf8');
 const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert(book.includes('galleryChapter(lang)'));assert(book.includes('return gallerySection(lang,i+1)'));
 assert(book.includes("'#ui-gallery']"));assert(book.includes('disposeGallery();'));
 assert(index.includes('book-ui-gallery.css?v=5.44.0'));
});
