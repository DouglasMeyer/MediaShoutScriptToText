String.prototype.RtfToText = function(){
  var rtfTag = /{[^{}]*}/g,
      prev = this,
      text = this.substr(1,this.length-2);
  while(prev !== text){
    prev = text;
    text = text.replace(rtfTag, '');
  }
  text = text.replace(/\\(pard|par)/g, "\n")
  text = text.replace(/\\[a-z0-9]+ ?/g,'');
  text = text.replace(/\\&([^;]+);[0-9]+/, "&$1;");
  return text.trim();
};

setTimeout(function(){

  jQuery('#dropbox').
    bind('dragenter', function(e){
      $(this).addClass('dragging');
      e.stopPropagation();
      e.preventDefault();
    }).
    bind('dragover', function(e){
      e.stopPropagation();
      e.preventDefault();
    }).
    bind('dragleave', function(e){
      $(this).removeClass('dragging');
      e.stopPropagation();
      e.preventDefault();
    }).
    bind('drop', function(e){
      $(this).addClass('dropped').removeClass('dragging');
      e.stopPropagation();
      e.preventDefault();

      var dt = e.originalEvent.dataTransfer;
      var files = dt.files;

      var output = document.getElementById('output');
      output.contentEditable = true;
      for(var i=0;files[i];i++){
        var file = files[i], reader = new FileReader();
        reader.onload = function(e) {
          output.innerHTML += "<h1>"+file.name+"</h1>";
          var xml = jQuery(e.target.result),
              totalCues = parseInt(xml.find('TotalCues').text());

          for(var cueIndex=0;cueIndex < totalCues; cueIndex++){
            var cue = xml.find('CueN'+cueIndex),
                playCount = parseInt(cue.find('PlayOrder ArraySize').text()),
                cueType = parseInt(cue.find('cuetype').text());
            // 5=song 0=text 1=bible
            output.innerHTML += '<h2>'+cue.find('Title').text();
            if (cueType !== 1) {
              for(var elementIndex=0;elementIndex<playCount;elementIndex++){
                var playElement = cue.find('PlayOrder Element'+elementIndex),
                    text = playElement.find('Text').text();
                output.innerHTML += '<!-- '+text+' --><pre>'+text.RtfToText()+'</pre>';
              }
            }
          }

        }
        reader.readAsText(file);
      }

    });

});
