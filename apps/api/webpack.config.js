const { join, resolve } = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { IgnorePlugin } = require('webpack'); // 1. Import Webpack

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: {
      '@org/database$': resolve(__dirname, '../../libs/database/src/index.ts'),
      '@org/database/schema$': resolve(
        __dirname,
        '../../libs/database/src/schema.ts',
      ),
      '@org/database/relations$': resolve(
        __dirname,
        '../../libs/database/src/relations.ts',
      ),
    },
    extensions: ['.ts', '.js'],
  },
  externals: {
    '@nestjs/websockets': 'commonjs @nestjs/websockets',
    '@nestjs/microservices': 'commonjs @nestjs/microservices',
    '@nestjs/swagger': 'commonjs @nestjs/swagger',
    'swagger-ui-express': 'commonjs swagger-ui-express',
  },
  performance: {
    hints: false,
  },
  ignoreWarnings: [
    { module: /express\/lib\/view\.js/, message: /Critical dependency/ },
    { module: /nestjs-graphql-connection/ },
    { module: /ts-class-initializable/ },
    { message: /Failed to parse source map/ },
    { message: /Can't resolve '@nestjs\/websockets'/ },
  ],
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
    // 2. Add IgnorePlugin to forcefully skip the failing optional packages
    new IgnorePlugin({
      resourceRegExp:
        /^(bufferutil|utf-8-validate|class-transformer\/storage|@nestjs\/graphql)$/,
    }),
  ],
};
