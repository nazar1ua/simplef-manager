var events = require('events');
var fs = require('fs');
var path = require('path');
var jade = require('jade');
var util = require('util');
var mime = require('./mimeType');

// Template engine
var gen_files_view = jade.compile([
   '- each file in files',
   '  .file(data-path="#{file.path}")',
   '    .icon',
   '      img(src="icons/#{file.type}.png")',
   '    .name.text-truncate #{file.name}',
].join('\n'));

const assignRows = (elements) => {
   let row = 0;
   let odd = true;
   [...elements.children].forEach((el) => {
      // remove old classes every time the screen gets resized and set back to default
      el.className = 'file';
      if (!el.previousElementSibling || el.offsetLeft < el.previousElementSibling.offsetLeft) {
         row++;
         odd = !odd;
      }
      // adds a class of row1, row2, row3
      el.classList.add(`row-no-${row}`, `${odd ? 'wrapped' : 'not-wrapped'}`);
   });
};

const observer = new ResizeObserver((entries) => {
   entries.forEach((entry) => {
      assignRows(entry.target);
   });
});

observer.observe(document.getElementById('files'))
assignRows(document.getElementById('files'))

// Our type
function Folder(jquery_element) {
   events.EventEmitter.call(this);
   this.element = $(jquery_element);

   var self = this;
   // Click on blank
   this.element.parent().on('click', function () {
      const currentElement = self.element.children('.focus')
      currentElement.removeClass('focus position-absolute').find('.name').addClass('text-truncate')
      currentElement.next().css('margin-left', '2px')
      currentElement.prev().css('margin-right', '2px')
   });
   // Click on file
   this.element.delegate('.file', 'click', function (e) {
      const currentElement = self.element.children('.focus')
      currentElement.removeClass('focus position-absolute').find('.name').addClass('text-truncate')
      currentElement.next().css('margin-left', '2px')
      currentElement.prev().css('margin-right', '2px')

      $(this).addClass('focus position-absolute').find('.name').removeClass('text-truncate')
      $(this).css({
         'top': this.offsetTop - 2 + 'px',
         'left': this.offsetLeft - 2 + 'px',
      })
      if (!$(this).next().hasClass('wrapped')) {
         $(this).next().css({
            'margin-left': Math.round($(this).width()) + 10 + 'px',
         })
      } else {
         $(this).prev().css({
            'margin-right': Math.round($(this).width()) + 10 + 'px',
         })
      }
      e.stopPropagation();
   });
   // Double click on file
   this.element.delegate('.file', 'dblclick', function () {
      var file_path = $(this).attr('data-path');
      self.emit('navigate', file_path, mime.stat(file_path));
   });
}

util.inherits(Folder, events.EventEmitter);

Folder.prototype.open = function (dir) {
   var self = this;
   fs.readdir(dir, function (error, files) {
      if (error) {
         console.log(error);
         window.alert(error);
         return;
      }

      for (var i = 0; i < files.length; ++i) {
         files[i] = mime.stat(path.join(dir, files[i]));
      }

      self.element.html(gen_files_view({ files: files }));
   });
}

exports.Folder = Folder;
