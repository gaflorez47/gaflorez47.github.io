$(function(){
  var bmcSections = ['key_partners', 'key_activities', 'key_resources', 'value_proposition',
      'customer_relationships', 'channels', 'customer_segments', 'cost_structure', 'revenue_streams'];
  var $sticky = $('.sticky.template').clone();
  var oldValue = "";
  var editor = null; 

  $sticky.show();
  $sticky.removeClass('template');
  var readComment = function(comment, $sticky){
    if (typeof comment == 'string'){
      return comment;  
    }
    else if( Object.prototype.toString.call(comment) == '[object Array]'){
      var $list = $('<ul>');
      for(var i = 0; i < comment.length; i++){
        var $li = $('<li>');
        $li.html(readComment(comment[i]));
        $list.append($li);
      }
      return $list.html();
    }
    else if(typeof comment == 'object'){
      var str = '';
      for(var key in comment){
        if(key == 'color'){
          $sticky.addClass(comment[key]);
        }
        else if(key == 'text'){
          str += comment[key];
        }
        else{
          str +=  key + ':<br>'+ readComment(comment[key]);
        }
      }
      return str;
    }
  }

  var configureEditor = function(){
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/yaml");
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setTabSize(2);
    editor.setValue(oldValue);
    editor.getSession().on('change', function(e) {
      var newYaml = editor.getValue();
      changeDocument(newYaml);
    });
  }

  var changeDocument = function(data){
    try{
      var doc = jsyaml.load(data);
    }
    catch(err){
      return false;      
    }
    oldValue = data;
    $(".project_name").text(doc['project_name']);
    for(var i = 0; i < bmcSections.length; i++){
      section = bmcSections[i];
      var $list = $('.sticky_list', '.canvas .'+section);
      $list.empty();

      var sectionData = doc[section];
      if(sectionData) for(var j = 0; j < sectionData.length; j++){
        var comment = sectionData[j];

        $newSticky = $sticky.clone();
        $newSticky.html(readComment(comment, $newSticky));
        $list.append($newSticky);  
      }
    }
  }

  $.get( "./example.yml", function( data ) {
    oldValue = data;
    changeDocument(data);
    showHideEditor();
  });

  
  var showHideEditor = function(){
    var showingEditor = !$('#editor').hasClass("hidden");;
    if(showingEditor){
      $('.btn_edit').text("Edit");
      $('#editor').addClass("hidden");
    }
    else{
      if(!editor) configureEditor();
      $('.btn_edit').text("Close editor"); 
      $('#editor').removeClass("hidden");
    }
    showingEditor = !showingEditor;
  };


  $('.btn_edit').click(function(e){
    showHideEditor();
  });

});