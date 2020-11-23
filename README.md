# Yet Another Handlebars for Deno

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/raw.githubusercontent.com/cybertim/yandlebars/main/mod.ts)

A Deno library to use https://handlebarsjs.com/ in Deno.

## Examples

```typescript
const yandlebars = new Yandlebars({
    baseDir: "views",
    partialDir: "partials",
    defaultLayout: "main",
    extension: ".hbs",
    useCache: true
});

await yandlebars.render("index", {"greeting": "hello"});
```

## Documentation
View it online at [doc.deno.land](https://doc.deno.land/https/raw.githubusercontent.com/cybertim/yandlebars/main/mod.ts)