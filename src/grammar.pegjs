
// This grammar does not handle empty html between tags.
// We assume, that in mindor, there is no need for <b>surroundings for tags</b>
// Building:
// pegjs -e Parser grammar.pegjs grammar.js

Root
    = Node? (Tags Node?)+ / Node  / Tags / ""
Node 
    = node:[^@]+ {return {node:node.join("")}}
Tags
    = tagList:Tag+    {return tagList}
Tag
    = "@" name:[A-z]+  TagSpaceDelimiter*  {return {tag:name.join("")}}
TagSpaceDelimiter
    =  " " / [\n]
TagHTMLDelimiter
    = "<" [^@>]+ ">"
