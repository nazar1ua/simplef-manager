const fs = require('fs');
const path = require('path');
const _ = require('underscore');

var map = {
   'compressed': ['zip', 'rar', 'gz', '7z'],
   'text': ['txt', 'md', ''],
   'image': ['jpg', 'jpge', 'png', 'gif', 'bmp'],
   'pdf': ['pdf'],
   'css': ['css'],
   'html': ['html'],
   'word': ['doc', 'docx'],
   'powerpoint': ['ppt', 'pptx'],
   'movie': ['mkv', 'avi', 'rmvb', 'mp4', 'mov'],
};

var cached = {};

exports.stat = function (filepath) {
   const result = {
      name: path.basename(filepath),
      path: filepath,
   };

   try {
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
         result.type = 'folder';
      } else {
         const ext = path.extname(filepath).substring(1).toLowerCase()
         result.type = cached[ext];
         if (!result.type) {
            for (let key in map) {
               if (_.include(map[key], ext)) {
                  cached[ext] = result.type = key;
                  break;
               }
            }

            if (!result.type)
               result.type = 'blank';
         }
      }
   } catch (e) {
      window.alert(e);
   }

   return result;
}