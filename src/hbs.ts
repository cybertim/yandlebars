import HandlebarsJS from "https://dev.jspm.io/handlebars@4.7.6";
import { join } from "https://deno.land/std/path/mod.ts";

type Template = (c: Record<string, unknown>) => string;

interface Handlebars {
    compile: (i: string) => Template;
    registerPartial: (n: string, t: string) => void;
    registerHelper: (n: string, f: (value: string) => string) => void;
}

interface HandlebarsConfig {
    baseDir: string;
    partialDir: string;
    extension: string;
    useCache: boolean;
}

/**
 * Yet Another Handlebars for Deno
 */
export class Yandlebars {

    private compileCache = new Map<string, Template>();

    private config: HandlebarsConfig = {
        baseDir: "views",
        partialDir: "partials",
        extension: ".hbs",
        useCache: true
    }

    constructor(config?: HandlebarsConfig) {
        if (config) this.config = config;
        for (const entry of Deno.readDirSync(join(this.config.baseDir, this.config.partialDir))) {
            if (entry.isFile && entry.name.endsWith(this.config.extension)) {
                const path = join(this.config.baseDir, this.config.partialDir, entry.name);
                const source = new TextDecoder("utf-8").decode(Deno.readFileSync(path));
                this.registerPartial(entry.name.replace(this.config.extension, ''), source);
            }
        }
    }

    /**
     * render a template from the config.baseDir
     * ```ts
     * const yandlebars = new Yandlebars();
     * await yandlebars.render("index", {"greeting": "hello"});
     * ```
     * @param view 
     * @param context 
     */
    async render(view: string, context: Record<string, unknown>) {
        let template = this.compileCache.get(view);
        if (template === undefined) {
            const path = join(this.config.baseDir, view + this.config.extension);
            const source = new TextDecoder("utf-8").decode(await Deno.readFile(path));
            template = (<Handlebars>HandlebarsJS).compile(source);
            if (this.config.useCache)
                this.compileCache.set(view, template);
        }
        return template(context);
    }

    /**
     * register more partials all files in the config.partialDir are automatically registered
     * @param name 
     * @param template 
     */
    registerPartial(name: string, template: string) {
        (<Handlebars>HandlebarsJS).registerPartial(name, template);
    }

    /**
     * register a basic helper with name as template element
     * ```ts
     * yandlebars.registerBasicHelper("hello", (value: string) => {
     *     return "hello " + value;
     * });
     * ```
     * @param name 
     * @param func 
     */
    registerBasicHelper(name: string, func: (value: string) => string) {
        (<Handlebars>HandlebarsJS).registerHelper(name, func);
    }

}
