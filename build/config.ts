import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { Options } from "unplugin-auto-import/types";
import Components from "unplugin-vue-components/vite";

// https://www.npmjs.com/package/vite-plugin-pages
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

const AutoOptions: Options = {
  // targets to transform
  include: [
    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/, // .vue
    /\.md$/ // .md
  ],

  // global imports to register
  imports: [
    // presets
    "vue",
    "vue-router",
    "pinia",
    // custom
    {
      "@vueuse/core": [
        // named imports
        "useMouse", // import { useMouse } from '@vueuse/core',
        // alias
        ["useFetch", "useMyFetch"] // import { useFetch as useMyFetch } from '@vueuse/core',
      ],
      axios: [
        // default imports
        ["default", "axios"] // import { default as axios } from 'axios',
      ]
      // "[package-name]": [
      //   "[import-names]",
      //   // alias
      //   ["[from]", "[alias]"],
      // ],
    },
    // example type import
    {
      from: "vue-router",
      imports: ["RouteLocationRaw"],
      type: true
    }
  ],

  // Filepath to generate corresponding .d.ts file.
  // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
  // Set `false` to disable.
  dts: "./auto-imports.d.ts",

  // 自定义解析器，兼容 `unplugin-vue-components`
  // see https://github.com/antfu/unplugin-auto-import/pull/23/
  resolvers: [
    ElementPlusResolver(),
    // 自动导入图标组件
    IconsResolver({
      prefix: "Icon"
    })
  ],

  // Generate corresponding .eslintrc-auto-import.json file.
  // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
  eslintrc: {
    enabled: false, // Default `false`
    filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
    globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
  }
};

export function pluginsList() {
  return [
    vue(),
    // Pages({
    //   extensions: ['vue', 'md'],
    //   dirs: [
    //     // basic
    //     { dir: 'src/pages/**', baseRoute: '.' },
    //     // // features dir for pages
    //     // { dir: 'src/features/**/pages', baseRoute: 'features' },
    //     // // with custom file pattern
    //     // { dir: 'src/admin/pages', baseRoute: 'admin', filePattern: '**/*.page.*' },
    //   ],
    // }),
    Pages({
      extensions: ["vue", "md"]
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),
    AutoImport(AutoOptions),
    Components({
      resolvers: [
        //
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"]
        })
      ],
      dts: "./auto-imports.d.ts"
    }),
    Icons({
      autoInstall: true
    })
  ];
}
