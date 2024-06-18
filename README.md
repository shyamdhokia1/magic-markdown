# Magic Markdown

A beautiful text formatter that uses **GPT-4o** to convert plain, unformatted text into nicely formatted Markdown.

### [Check it out here -> magic-markdown.mercuryred.duckdns.org](https://magic-markdown.mercuryred.duckdns.org/)
![CopyQ gBARXL](https://github.com/shyamdhokia1/magic-markdown/assets/92919658/46853cf3-9e87-4dc7-a925-d8e76d28c8d2)

This started off as a project for the freeCodeCamp Front End course but I couldn't help add some LLM magic.

## Technologies
- **OpenAI API**
- **React**
- **Express**
- **Vite**
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
git clone https://github.com/shyamdhokia1/magic-markdown
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

Much thanks to the incredible courses from [freeCodeCamp](https://github.com/freeCodeCamp)



