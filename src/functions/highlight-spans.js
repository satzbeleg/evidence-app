/**
 * 
 * @param {String} text 
 * @param {Array[Array]} spans 
 * @param {String} tag 
 * @param {String} classattr 
 * 
 * EXAMPLES:
 *      import { highlightSpans } from '@/functions/highlight-spans.js';
 * 
 *  Just show what the function will do with a text string:
 *      var rawhtml = highlightSpans("Die Wolken heben sich vom Boden ab.", 
 *                                   [[11, 16], [32,34]], 'strong', 'myclass');
 *
 *  In Vue.js we display raw html with the "v-html" directive
 *      <div v-html="myrawhtml"></div>
 *      const myrawhtml = computed(() => highlightSpans(item.text, item.spans, 'b'))
 * 
 *  You could also manipulate the DOM directly by overwriteing .innerHTML
 *      <div id="myelem">
 *      ...
 */
export const highlightSpans = (text, spans, tag = "b", classattr = undefined) => {
  if (typeof text == "string" && typeof spans == "object" && typeof tag == "string") {
    if (spans.length > 0) {
      // sort spans descending
      spans = spans.sort((a, b) => { return b[0] - a[0] });
      // add html tags to string
      spans.forEach(span => {
        text = `${text.slice(0, span[0])}<${
                    tag}${classattr ? ' class="'+classattr+'"' : ""}>${
                    text.slice(span[0], span[1])}</${tag}>${
                    text.slice(span[1], text.length)}`;
      });
    }
  }
  // done
  return text;
}