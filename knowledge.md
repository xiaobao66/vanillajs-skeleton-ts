# babel配置

## 配置文件

babel有两种并行的配置读取方式：

- 全局配置文件
    - `babel.config.json`或者其他等价后缀名的文件
- 局部配置文件
    - `.babelrc.json`或者其他等价后缀名的文件
    - 存在`babel`配置的`package.json`文件

### 全局配置文件

babel会从配置的`root`项中寻找`babel.config.json`或者其等价文件，默认是命令运行的当前目录。
例如，有个项目结构如下：

```
root
│   babel.config.js    
│   package.json    
└───packages
│       └───react-project
│                │  package.json
│                │  webpack.config.js
```

在`root`目录下运行编译命令，则会在`root`目录寻找配置文件；在`react-project`目录下运行编译命令，则会在`react-project`目录寻找配置文件(当然这是找不到的)

当然，我们也可以通过显示地修改配置中`configFile`项，来重新指定全局配置文件

### 局部配置文件

babel会从当前正在编译的文件所在目录向上寻找`.babelrc.json`或者其他等价文件。我们可以使用局部配置来重置全局配置。但是，有一些必须注意的事项：

- 一旦遇到`package.json`文件，整个查找过程将中止，因此局部配置文件适用于独立的package
- 正在编译的文件必须在配置项`babelrcRoots`设置的目录下，否则查找过程将会跳过该文件

这意味着：

- `.babelrc.json`必须存在于自己的package中
- `.babelrc.json`所在的package如果不在Babel的`root`或者配置项`babelrcRoots`中，将会被忽略

## @babel/preset-env

`@babel/preset-env`是一套es6插件预置合集，能够根据你配置的运行环境自动决定要转义的代码

### useBuiltIns

该配置决定了`@babel/preset-env`如何处理polyfills
`useBuiltIns`有三个值：`entry`|`usage`|`false`，默认是`false`

当使用`entry`|`usage`时，`@babel/preset-env`会在文件中直接添加关于`core-js`的引用，所以需要安装`core-js`模块

```bash
npm install core-js@3 --save
```

#### useBuiltIns:entry

使用这个配置将会根据配置的运行环境，替换入口文件中：`import "core-js/stable"`和`import "regenerator-runtime/runtime"`语句，因此需要有一个入口文件，并显示引用以上内容

#### useBuiltIns:usage

会在每个文件顶部，根据配置的运行环境，结合文件内容引入相应的`polyfill`

#### useBuiltIns:false

不自动为每个文件添加polyfill，以及不将`import "core-js"`和`import "@babel/polyfill"`转换为独立的polyfill

### core-js

指定`core-js`版本，以及是否开启对提案中的内容进行转换
`core-js`的值：`2`|`3`|`{ version: 2 | 3, proposals: boolean }`，默认值是`2`

这个选项只对`useBuiltIns:entry`和`useBuiltIns:usage`生效，用于指定`@babel/preset-env`插入正确的`core-js`版本
默认`core-js`是不对提案内容进行支持的，如果想要支持提案内容，有以下方式配置：

- `useBuiltIns:entry`：可以在入口文件直接引入[提案polyfill](https://github.com/zloirock/core-js/tree/master/packages/core-js/proposals)，比如：`import "core-js/proposals/string-replace-all"`
- `useBuiltIns:usage`：需要将`proposals`设置为`true`，即：`{ version: 2 | 3, proposals: true }`

# eslint配置

## 配置文件

eslint有两种使用配置文件的方式：

- 第一种方式通过使用`.eslintrc.*`或`package.json`配置文件。eslint将自动从待检测文件所在目录开始，逐级向上查找父目录，直到根目录或者指定了`root:true`的配置文件
- 第二种方式通过命令行，将配置文件路径直接传递给`CLI`，例如：

```bash
eslint -c myconfig.json myfiletotest.js
```

### 优先级

假设有如下目录结构：

```
your-project
├── .eslintrc
├── lib
│ └── source.js
└─┬ tests
  ├── .eslintrc
  └── test.js
```

在`/lib`目录下的文件将使用项目根目录的`.eslintrc`，当遍历到`tests`目录时，它下面的文件除了使用根目录的`.eslintrc`外，还将使用`tests`目录下自身的`.eslintrc`,
最终的配置项是二者的组合，并且最靠近待检测文件的`.eslintrc`优先

假如同层目录下有多个配置文件，它们的优先级依次如下：

1. .eslintrc.js
2. .eslintrc.cjs
3. .eslintrc.yaml
4. .eslintrc.yml
5. .eslintrc.json
6. .eslintrc
7. package.json

前面的优先级的文件一旦使用，后面的文件将被忽略

# webpack配置

## resolve

`resolve`用于设置webpack如何解析模块

```
{
    resolve: {
        modules: ['node_modules'], // 指定webpack从哪个目录解析模块
        extensions: ['.js', 'jsx'], // 依次解析指定后缀名文件
        alias: { // 为引用的模块设置别名，指定其查找目录
            Utilities: path.resolve(__dirname, 'src/utilities/'),
        },
    }
}
```

### resolve.modules 

`resolve.modules`指定webpack从哪个目录解析模块，可以设置绝对路径和相对路径

- 绝对路径：只在指定的目录查找文件
- 相对路径：会从当前目录开始，依次查找其父级目录，直到找到文件为止

## output

output用于配置webpack如何生成编译文件，如：资源文件、js脚本等

### output.library

`string|object`

当使用webpack编译类库时用到，用于指定类库的命名空间(`namespace`)，具体的导出形式由`output.libraryTarget`决定

```
module.exports = {
  //...
  output: {
    library: 'MyLibrary'
  }
};
```

### output.libraryTarget

`string`

定义了类库以什么方式导出(`expose`)，默认值是`var`，主要的形式有以下几种：
(以下所有示例，假定`output.library`设置为`MyLib`，`entry`入口文件编译后的结果为`_entry_return_`)

- `var`

编译后的结果将赋值给一个全局变量，变量名为`output.library`设置的

```
var MyLib = _entry_return_
```

- `this`

`output.library`将作为`this`下的一个`key`，用来接收编译结果

```
this['MyLib`] = _entry_return_
```

- `window`

`output.library`将作为`window`对象下的一个`key`，用来接收编译结果

```
window['MyLib`] = _entry_return_
```

- `global`

`output.library`将作为`global`对象下的一个`key`，用来接收编译结果

```
global['MyLib`] = _entry_return_
```

- `umd`

将编译后的结果以通用模块的形式导出，让其能够在`CommonJs`、`AMD`、`global variable`环境下使用

配置:

```
module.exports = {
  //...
  output: {
    library: 'MyLibrary',
    libraryTarget: 'umd'
  }
};
```


输出结果:

```
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports['MyLibrary'] = factory();
  else
    root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```

## module

该配置决定webpack如何处理指定类型的模块

### module.rules

`[Rule]`

该选项用于设置指定类型的模块以何种方式进行处理，值类型是一个包含`Rule`对象的数组

#### Rule

`object`

具体的模块规则，每条规则由三部分组成：`条件(conditions)`、`结果(results)`和`嵌套规则(nested rules)`

##### Rule Conditions

条件有两种输入形式：

- resource：请求文件的绝对路径，它已经过`resolve`规则解析
- issuer：发出资源请求的模块的绝对路径，是导入时的位置

> 例如：在`app.js`中`import './style.css'`，`resource`指的是`/path/to/style.css`，而`issuer`指的是`/path/to/app.js`

在Rule的属性中，`test`、`include`、`exclude`和`resource`属性匹配`resource`规则；`issuer`属性匹配`issuer`规则

##### Rule Results

只有当条件匹配了结果才会生效

结果有两种输出形式：

- 应用的`loaders`：应用在资源上的loader数组
- parser选项：用于设置该模块的解析器规则

与`loaders`相关的属性：`loader`、`options`和`use`，也兼容`query`和`loaders`

`enforce`属性会影响`loader`的种类，不论它是普通loader、前置loader还是后置loader

与`parser`相关的属性：`parser`

##### Nested Rules

嵌套规则可用于细化父规则，它们可以包含自己的条件。只有当父规则匹配，嵌套规则才生效。

可以通过`rules`和`oneOf`两个属性来设置嵌套规则

规则的优先级如下：

1. 父规则
2. `rules`
3. `oneOf`

## DllPlugin

动态链接库，使用`DllPlugin`和`DllReferencePlugin`将打包文件中的公共资源进行分离，提高编译速度

使用过程分为以下两步：`构建dll库`和`引用dll库`

I. 构建dll库

a. 定义一个用于打包dll库的webpack配置文件(如：`webpack.dll.config.js`)，使用插件`DllPlugin`输出`manifest.json`映射文件

```js
const path = require('path');

module.exports = {
  entry: {
    dependencies: ['react', 'react-dom'], // 需要打包成dll库的文件
  },

  output: {
    path: path.join(__dirname, 'dist', 'dll'),
    filename: '[name].dll.js',
    library: '_dll_[name]_[hash]',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      context: __dirname, // manifest缓存文件的请求上下文
      path: path.join(__dirname, 'dist', 'dll/[name].manifest.json'), // manifest.json文件输出位置
      name: '_dll_[name]_[hash]', // 和library设置的一致，输出的manifest.json中的name值
    }),
  ],
};
```

构建完成后将得到两个文件：`dependencies.dll.js`和`dependencies.manifest.json`

- `dependencies.dll.js`：构建后的dll库文件
- `dependencies.manifest.json`：库映射文件

b. 在`package.json`里新增构建dll的命令

```
{
    "scripts": {
        "dll": "webpack --config webpack.dll.config.js --mode production"
    }
}
```

II. 引用dll库

a. 配置项目webpack主配置文件，如：`webpack.config.js`，需要使用`DllReferencePlugin`插件

```js
const webpack = require('webpack');

module.exports = {
  // ...其他webpack配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname, // 这个context必须和DllPlugin的保持一致，否则dll库无法链接
      manifest: require(path.join(__dirname, 'dist', 'dll/[name].manifest.json')), // dll编译生成的manifest文件
    }),
  ]
};
```

b. 在项目html模板中注入`dependencies.dll.js`

```html
<script src="/dll/dependencies.dll.js"></script>
```

但是手动注入的方式既繁琐又易错，为了减少构建过程中的人工干预，降低出错可能，决定使用`html-webpack-tags-plugin`插件实现自动注入dll文件

具体来说，就是在webpack配置中增加如下内容：

```js
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
  plugins: [
    // ...其他配置
    new HtmlWebpackTagsPlugin({
      // 将dll库文件插入到html中，需要放在HtmlWebpackTagsPlugin之后
      append: false,
      scripts: ['dll/dependencies.dll.js'],
    }),
  ],
};               
```

完整配置如下：

```js
const webpack = require('webpack');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
  // ...其他webpack配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname, // 这个context必须和DllPlugin的保持一致，否则dll库无法链接
      manifest: require(path.join(__dirname, 'dist', 'dll/[name].manifest.json')), // dll编译过程生成的manifest文件
    }),
    new HtmlWebpackTagsPlugin({
      // 将dll库文件插入到html中，需要放在HtmlWebpackTagsPlugin之后
      append: false, // 插入在其他webpack生成的bundle文件前
      scripts: ['dll/dependencies.dll.js'],
    }), 
  ]
};
```

以上就实现了dll动态链接库功能

## optimization

### splitChunks

抽取公共代码，减少bundle大小

默认的`splitChunks`配置只对按需加载的chunk生效，因为修改初始加载的chunk会影响HTML文件里引用的script标签

webpack默认将按照下述的条件进行模块拆分：

- 新生成的chunk被其他chunk引用，或者模块来自`node_modules`
- 新生成的chunk要大于30kb
- 按需加载的模块最大并行请求数<=6
- 初始加载的模块最大并行请求数<=4

完整的默认配置如下：

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

配置时，通过设置`cacheGroups`缓存组实现根据不同条件生成不同公共文件的需求

#### splitChunks.cacheGroups

`object`

`cacheGroups`将会继承之前默认配置中，所以非`cacheGroups`的配置，并且可以根据自己的需要进行覆盖

除了继承而来的配置外，每个`cacheGroup`还额外增加以下几个属性：

- test
- priority
- enforce

##### splitChunks.cacheGroups.{cacheGroup}.test

`function (module, chunk) => boolean | RegExp | string`

缓存组匹配条件，指定哪些模块将被此缓存组选中。省略将匹配所有模块，如果chunk的名称被命中，则chunk下所有的模块都被选中

##### splitChunks.cacheGroups.{cacheGroup}.priority

`number`

缓存组权重，当模块匹配多个缓存组时，缓存组权重高的优先，自定义的缓存组默认权重为`0`，系统默认的缓存组权重为负值

##### splitChunks.cacheGroups.{cacheGroup}.enforce

`boolean = false`

告知webpack是否忽略chunk的一些限制(`splitChunks.minSize`，`splitChunks.minChunks`，`splitChunks.maxAsyncRequests`和`splitChunks.maxInitialRequests`)，强制生成符合此缓存组的chunk

#### splitChunks.chunks

`string | function (chunk) => boolean`

指示从哪种类型的模块中抽取公共代码，字符串值一共有三种类型：`initial`、`async`、`all`，

- `initial`：初始模块，既在项目刚运行时就加载的模块
- `async`：异步模块，区别于初始模块，即在项目运行过程中，按需加载的模块
- `all`：全模块，包含上述提到的两种模块

