# Magic Markdown

A beautiful text formatter that uses **GPT-4o** to convert plain, unformatted text into nicely formatted Markdown.

### _[Check it out here](https://magic-markdown.mercuryred.duckdns.org/)_

This started off as a project for the freeCodeCamp Front End course but I couldn't help add some LLM magic.

## Technologies
- **OpenAI API**
- **React**
- **Express**
- **Node.js**
- **TailwindCSS**
- **DaisyUI**

Hosted on my homelab server using **Docker Compose** and **NGINX** reverse proxy.

## Running Developer Environment and Building

**OpenAI API**
Add your OpenAI API key to `.env`

**Install the dependencies**
```
npm i marked isomorphic-dompurify openai best-effort-json-parser highlight.js react-copy-to-clipboard express
```
**DOMPurify** is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML

**Clone the git repo**
```
git clone
```
**Run the dev environment**
```
npm run dev
```
**Build**
```
npm run build
```
**Serve with Express**
```
node server.js
```
**Docker Container**
```
docker compose up -d
```



