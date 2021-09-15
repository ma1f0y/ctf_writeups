# Lisp to HTML

* challenge site : https://lisp.gohackyourself.co
* author : [TomNomNom](https://twitter.com/TomNomNom)

## tl;dr
* using js logic add script as string
* final payload ``(ul (script() "alert(document.domain)")``

## Intro
We were give a site which converts Lisp format to HTML.
If we give ``(p "Try me!") (ul (li "One") (li "Two") (li "Three"))`` as input ,it will convert it into
```html
<p>Try me!</p><ul><li>One</li><li>Two</li><li>Three</li></ul>
```
The logic responsible for conversion is in the ``lisp.js``.Our goal is somehow get xss in the site

## Analysis
```js
const tokens = []
const state = {
    buf: '',
    inString: false,
    inEscape: false,
}
for (const c of input.split('')){
    switch (c) {

        // parens
        case '(':
        case ')':
            if (state.inString){
                state.buf += c
                continue
            }
            if (state.buf != ''){
                tokens.push({type: "string", val: state.buf})
                state.buf = ''
            }
            tokens.push({type: "paren", val: c})
            continue

        // escapes
        case '\\':
            if (state.inEscape){
                state.buf += c
                state.inEscape = false
            } else {
                state.inEscape = true
            }
            continue

        // quotes
        case '"':
            // escaped quote
            if (state.inEscape){
                state.buf += c
                state.inEscape = false
                continue
            }
            // end of string
            if (state.inString){
                tokens.push({type: "string", val: state.buf})
                state.buf = ''
            }
            state.inString = !state.inString
            continue

        // whitespace
        case ' ':
        case '\n':
        case '\r':
        case '\t':
            if (state.inString){
                state.buf += c
                continue
            }
            if (state.buf != ''){
                tokens.push({type: "tag", val: state.buf})
                state.buf = ''
            }
            continue

        // everything else
        default:
            state.buf += c
    }
}
```
we can see it stores our input in three types in tokens array ``paren``,``tag``,``string``

```js
const allowedTags = ['h1', 'h2', 'h3', 'div', 'ul', 'ol', 'li', 'b', 'strong', 'em', 'br', 'p']
tokens.forEach(t => {
    if (t.type == "tag" && !allowedTags.includes(t.val)){
        throw `invalid tag (${t.val})`
    }
})
```
then it check if the tags in the tokens are in the allowed list,if not it will throw an error
If the check passes it will create a node array by checking if it is in ``()`` 
Then it will create  elements from the node array and append it to the output div-tag

## bug

The application was checking for space to determine if it is a ``tag`` or not. if we add a bracket without space to an opened element it will be consider  as string.

poc:
```(ul()``` 

*Note :here ul will be added as string in tokens*

By using the js logic we can make script  tag as string in tokens .So it will not be checked with valid tags . 

Then we can add brackets after script so that it will added as array and it will create a node for that also

## Final Payload : 
``(ul (script() "alert(document.domain)")``
