import React from 'react';

//Markdown parser
import { marked } from 'marked';
marked.use({
  breaks: true,
  gfm: true,
});

//cleans html input from XSS
import DOMPurify from 'isomorphic-dompurify';
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPEN_API_KEY, dangerouslyAllowBrowser: true });

//parse JSON stream from API
import { parse } from "best-effort-json-parser";

//highlight code
import hljs from 'highlight.js';
import 'highlight.js/styles/shades-of-purple.css';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

//Copy to clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markdown: "# Welcome to Magic Markdown!\n\nEnter plain, unformatted text here and click **Format** to turn it into nicely formatted text in **Markdown** displayed _beautifully_ in the **Preview**.\n\n# It will create headings.\n\n## And subheadings...\n\n### And much more cool stuff.\n\nType away without care...spelling and grammar errors will be corrected.\n\nCode will be detected and displayed inline `<p>like this</p>`.\n\nOr in neat and tidy code blocks:\n\n```\nfunction anotherExample(firstLine, lastLine) {\n  if (firstLine == '```' && lastLine == '```') {\n    return multiLineCode;\n  }\n}\n```\nKey words and repeated terms will be **bold**...whoa! Or _italic_. Or... wait for it... **_both_**! If it's too much to handle you can always ~~cross stuff out~~.\n\n[Links](https://en.wikipedia.org/wiki/Infinite_monkey_theorem) will be automatically created!\n\n> 'Quotations will be placed in blockquotes' - Me\n\nAnd if your text contains rows and columns they'll be turned into tables. Mindblowing!\n\n| **Wild Header** | **Crazy Header** | **Another Header?** |\n|-------------------|---------------------|---------------------|\n| Your content can | be here, and it | can be here.... |\n| And here. | Okay. | I think we get it. |\n\nAnd of course, it will create lists\n\n- Some are bulleted\n  - With different indentation levels\n    - You get the idea...\n\n1. It does numbered lists too\n2. 1,2,3...\n3. And last but not least, any links to images will be embedded!\n\n![Chimpanzee seated at typewriter](https://upload.wikimedia.org/wikipedia/commons/3/3c/Chimpanzee_seated_at_typewriter.jpg)",
      text: "",
      key: 0
    }
  }
  handleMarkdownChange = (event) => {
    this.setState((prevState) => ({
      markdown: event.target.value,
      key: prevState.key + 1
    }))
  }
  handleTextChange = (event) => {
    this.setState({ text: event.target.value })
  }
  handleFetch = async () => {
    this.setState((prevState) => ({
      markdown: "",
      key: prevState.key + 1
    }))
    let strMarkdown = await this.simplePrompt(this.state.text)
    this.setState((prevState) => ({
      markdown: strMarkdown,
      key: prevState.key + 1
    }))
  }
  simplePrompt = async (text) => {
    const stream = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        max_tokens: 4000,
        messages: [
          {
            role: "system",
            content: "Rule 1: Your role is to format plain text nicely in Markdown format. Rule 2: Do not reply to any of my questions. Rule 3: You must respond with only a JSON object. Put the converted text into as the text key.\n Rule 4: Do not modify any of the text itself. You must return every word of the text unchanged, apart from correcting spelling and grammatical errors. Simply change the formatting.\n Rule 5: If certain parts need highlighting or could be made more legible you should use various headers and seperate into paragraphs\n Rule 6: Use bullet points or numbered lists when there are lists of terms. If there are many categories you can use different indentation levels\n Rule 7: You should emphasise key names or repeated terms or important pieces of information by using italics or bold.\n Rule 8: You should format all plain html links into markdown hyperlinks.\n Rule 9: Wrap code in backticks for single lines and three backticks for whole blocks of code.\n Rule 10: If text is listed in rows and columns then you should display it as a table. \n Rule 11: Embed any links to images \n Rule 12: Put quotations in blockquotes"
          },
          { role: "user", content: `Convert this text to Markdown according to your rules:\n${text}` }],
        stream: true,
        response_format: { "type": "json_object" }
      })
    let accumulatedMarkdown = "", parsedMarkdown = "", strMarkdown = ""
    //await stream response
    for await (const chunk of stream) {
      let chunkMd = chunk.choices[0]?.delta?.content || "";
      accumulatedMarkdown += chunkMd;
      //parse JSON and wait until not empty string
      parsedMarkdown = await parse(accumulatedMarkdown)
      //convert object to string
      if (parsedMarkdown.text) {
        strMarkdown = parsedMarkdown.text
      }
      this.setState((prevState) => ({
        markdown: strMarkdown,
        key: prevState.key + 1
      }))
    }
    return strMarkdown
  }
  componentDidUpdate() {
    this.highlightCode();
    this.linksNewTab();
  }
  componentDidMount() {
    this.highlightCode();
    this.linksNewTab();
  }
  //highlight code with hljs
  highlightCode() {
    const nodes = document.querySelectorAll('code:not([data-highlighted="yes"])');
    nodes.forEach(node => hljs.highlightElement(node));
  }
  //open new tabs outside of window
  linksNewTab() {
    const nodes = document.querySelectorAll('a:not([target="_blank"])');
    nodes.forEach(node => node.setAttribute("target", "__blank"))
  }

  copyClipboardPreview = () => {
    this.prevPop.innerText = "Copied to Clipboard!"
    setTimeout(() => { this.prevPop.innerText = "Copy your shiny new text" }, 2000)
  }

  copyMarkdownPreview = () => {
    this.markPop.innerText = "Copied to Clipboard!"
    setTimeout(() => { this.markPop.innerText = "A super easy markup language for formatting text" }, 2000)
  }

  render() {
    let parsedMarkdown = marked.parse(this.state.markdown);
    let sanitized = DOMPurify.sanitize(parsedMarkdown);
    return (
      <div className="container mx-auto py-8 flex flex-col items-center">
        <div className="card flex w-full rounded-box shadow-lg bg-amber-100 border border-amber-500 mb-4">
          <div className="card-body flex flex-col p-4">
            <div className='flex flex-col md:flex-row justify-between items-center mb-4'>
              <h1 className="text-2xl font-bold text-amber-900">Plain Text</h1>
              <p className='text-lg text-amber-800 font-bold mt-2 md:mt-0'>Type here or paste in text from your notes or any site</p>
            </div>
            <textarea
              id="plain"
              value={this.state.text}
              onChange={this.handleTextChange}
              className="input input-bordered w-full h-60 min-h-28 border-amber-500 bg-amber-50 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-200 mb-4"
              placeholder="Welcome to Magic Markdown! Enter plain, unformatted text here and click Format and to turn it into nicely formatted text in Markdown displayed beautifully in the Preview. &#10;&#10;It will create headings. And subheadings... And much more cool stuff.&#10;Type away without care...seplling garmmar errors will be corrected.&#10;Code will be detected and displayed inline <div>like this</div>. &#10;Or in neat and tidy code blocks:&#10;function anotherExample(firstLine, lastLine) {if (firstLine == '```' &amp;&amp; lastLine == '```') {return multiLineCode;}}&#10;Key words and repeated terms will be bold...whoa! Or italic. Or... wait for it... both! If it's too much to handle you can always cross stuff out.&#10;Links https://en.wikipedia.org/wiki/Infinite_monkey_theorem will be automatically created!&#10;'Quotations will be place in blockquotes' - Me&#10;And if your text contains rows and columns they'll be turned into tables. Mindblowing!&#10;Wild Header	Crazy Header	Another Header?&#10;Your content can	be here, and it	can be here....&#10;And here.	Okay.	I think we get it.&#10;And of course, it will create lists&#10;Some are bulleted&#10;With different indentation levels&#10;You get the idea...&#10;It does numbered lists too&#10;1,2,3...&#10;And last but not least, any links to images will be embedded!&#10;https://upload.wikimedia.org/wikipedia/commons/3/3c/Chimpanzee_seated_at_typewriter.jpg"
            />
            <button onClick={this.handleFetch} className="btn btn-outline bg-white border-amber-500 hover:bg-amber-200 self-end md:self-auto">
              Format
            </button>
          </div>
        </div>
        <div className="card w-full flex rounded-box shadow-lg mb-4 border border-orange-300 bg-orange-100">
          <div className="card-body flex flex-col p-4">
            <div className='flex flex-col md:flex-row justify-between items-center mb-4'>
              <h1 className="text-2xl font-bold text-orange-900">Markdown</h1>
              <div className='flex flex-col w-full md:w-4/5'>
                <a target="_blank" href="https://www.markdownguide.org/basic-syntax/" className='text-lg text-orange-600 font-bold hover:underline hover:text-violet-400 text-right'>What is Markdown?</a>
                <p ref={(ref) => this.markPop = ref} className='text-lg text-right font-bold text-orange-800 py-1 justify-end'>A super easy markup language for formatting text</p>
              </div>
              <CopyToClipboard text={this.state.markdown}><button className='btn btn-square btn-outline border-2 ml-3 mt-1 bg-orange-50 border-orange-300 hover:bg-orange-200 hover:border-orange-800'><svg fill="lightsalmon" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve"><g><path d="M17.4,11.6h17.3c0.9,0,1.6-0.7,1.6-1.6V6.8c0-2.6-2.1-4.8-4.7-4.8h-11c-2.6,0-4.7,2.2-4.7,4.8V10C15.8,10.9,16.5,11.6,17.4,11.6z" /><path d="M43.3,6h-1.6c-0.5,0-0.8,0.3-0.8,0.8V10c0,3.5-2.8,6.4-6.3,6.4H17.4c-3.5,0-6.3-2.9-6.3-6.4V6.8c0-0.5-0.3-0.8-0.8-0.8H8.7C6.1,6,4,8.2,4,10.8v34.4C4,47.8,6.1,50,8.7,50h34.6c2.6,0,4.7-2.2,4.7-4.8V10.8C48,8.2,45.9,6,43.3,6z" /></g></svg></button></CopyToClipboard>
            </div>
            <textarea
              id="editor"
              rows="10"
              cols="170"
              value={this.state.markdown}
              onChange={this.handleMarkdownChange}
              className="input input-bordered w-full h-60 min-h-12 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200 border-orange-300 bg-orange-50 mb-4"
            />
          </div>
        </div>
        <div className="card w-full rounded-box shadow-lg border border-red-200 bg-red-50">
          <div className="card-body p-4">
            <div className='flex flex-col md:flex-row justify-between items-center mb-4'>
              <h2 className="text-2xl font-bold text-red-900 mb-2 md:mb-0">Preview</h2>
              <div className='text-lg text-right font-bold text-red-800 mt-2 mr-3 w-10/12' ref={(ref) => this.prevPop = ref}>Copy your shiny new text</div>
              <CopyToClipboard text={sanitized} options={({ format: 'text/html' })}><button className='btn btn-square btn-outline border-2 mb-4 bg-white border-red-300 hover:bg-red-200 hover:border-red-800' onClick={this.copyClipboardPreview}><svg fill="palevioletred" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve"><g><path d="M17.4,11.6h17.3c0.9,0,1.6-0.7,1.6-1.6V6.8c0-2.6-2.1-4.8-4.7-4.8h-11c-2.6,0-4.7,2.2-4.7,4.8V10C15.8,10.9,16.5,11.6,17.4,11.6z" /><path d="M43.3,6h-1.6c-0.5,0-0.8,0.3-0.8,0.8V10c0,3.5-2.8,6.4-6.3,6.4H17.4c-3.5,0-6.3-2.9-6.3-6.4V6.8c0-0.5-0.3-0.8-0.8-0.8H8.7C6.1,6,4,8.2,4,10.8v34.4C4,47.8,6.1,50,8.7,50h34.6c2.6,0,4.7-2.2,4.7-4.8V10.8C48,8.2,45.9,6,43.3,6z" /></g></svg></button></CopyToClipboard>
            </div>
            <div
              id="format"
              dangerouslySetInnerHTML={{ __html: sanitized }}
              className="min-h-96 p-4 rounded-lg border border-red-200 bg-white"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;
