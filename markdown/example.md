# Markdown Syntax Reference Guide

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Text Formatting

**Bold text** or __Bold text__

*Italic text* or _Italic text_

***Bold and italic text*** or ___Bold and italic text___

~~Strikethrough text~~

<mark>Highlighted text</mark> (HTML tag)

Superscript: x<sup>2</sup> (HTML tag)

Subscript: H<sub>2</sub>O (HTML tag)

## Lists

### Unordered Lists
* Item 1
* Item 2
  * Nested item 2.1
  * Nested item 2.2
* Item 3

Or with alternative symbols:
- Item 1
- Item 2
+ Item 3

### Ordered Lists
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Links

[Link text](https://www.example.com)

[Link with title](https://www.example.com "Title text")

Auto-convert URL: https://www.example.com

Reference-style link: [Reference link][reference]

[reference]: https://www.example.com "Optional title"

## Images

![Alt text](https://example.com/image.jpg)

![Alt text](https://example.com/image.jpg "Image title")

Reference-style image: ![Alt text][image]

[image]: https://example.com/image.jpg "Optional title"

## Blockquotes

> Single blockquote
> 
> Still the same blockquote

> Nested blockquotes
>> Nested level 2
>>> Nested level 3

## Code

Inline code: `var example = "hello";`

```
// Code block without syntax highlighting
function example() {
  return "hello world";
}
```

```javascript
// Code block with syntax highlighting
function example() {
  return "hello world";
}
```

## Horizontal Rules

Three or more hyphens:
---

Three or more asterisks:
***

Three or more underscores:
___

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

Alignment:

| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |

## Footnotes

Here's a sentence with a footnote. [^1]

[^1]: This is the footnote.

## Definition Lists

Term
: Definition 1
: Definition 2

## Escaping Characters

\*Not italic\*

\# Not a heading

Escapable characters: \\ \` \* \_ \{ \} \[ \] \( \) \# \+ \- \. \! \|

## HTML in Markdown

<div style="color: red;">
  This is HTML embedded in Markdown
</div>

## Comments

<!-- This is a comment that won't appear in the rendered Markdown -->

## Emojis (GitHub Markdown)

:smile: :heart: :thumbsup:

## Abbreviations

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium

HTML is a markup language.