module.exports = {
  'presets': [
    '@vue/app'
    // ['env', {
    //     // 'modules': false,
    //     'targets:': { 'node': '10' }
    // }]
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}
