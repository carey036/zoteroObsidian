function citationString(citekey) {

    function yearString(citekey) {
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let yearString = data.fields.date[0].split("-")[0];
      return yearString
    }
  
    function authorsString(citekey) {
      let fullAuthorList = [];
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let authors = [];
      if (data.creators.author)
        authors = data.creators.author;
      else
        authors = [{literal: "NaN"}];
  
      authors.forEach(author => {
        const [firstNamesArray, lastNamesString] = findFirstLast(author);
        let str = [];
        str.push(lastNamesString)
        str.push(",");
        firstNamesArray.forEach(name => {
          str.push(` ${name[0]}.`);
        });
        fullAuthorList.push(str.join(""));
      });
      const authorString = joinAuthors(fullAuthorList);
      return replaceIllegalFileNameCharactersInString(authorString);
    }
  
    function joinAuthors(fullAuthorList) {
      const len = fullAuthorList.length;
      if (len == 1)
        return fullAuthorList[0];
      else if (len == 2)
        return fullAuthorList.join("\ and ");
      else if (len >= 3)
        return fullAuthorList[0] + " et al.";
    }
  
  
    function findFirstLast(author) {
      let lastNamesString = "";
      let firstNamesArray = [];
      if (author.lastName) {
        firstNamesArray = author.firstName.split(" ");
        lastNamesString = author.lastName;
      }
      else {
        let parts = author.literal.split(" ");
        firstNamesArray = parts.slice(0,parts.length-1);
        lastNamesString = parts[parts.length-1];
      }
      return [firstNamesArray, lastNamesString];
    }
  
    function replaceIllegalFileNameCharactersInString(string) {
      return string.replace(/[\\\/@]*/g, '');
    }
  
    function editorsString(citekey) {
      let fullEditorList = [];
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let editors = [];
      if (data.creators.editor)
        editors = data.creators.editor;
      else
        editors = [{literal: "NaN"}];
  
      editors.forEach(editor => {
        const [firstNamesArray, lastNamesString] = findFirstLast(editor);
        let str = [];
        str.push(lastNamesString)
        str.push(",");
        firstNamesArray.forEach(name => {
          str.push(` ${name[0]}.`);
        });
        fullEditorList.push(str.join(""));
      });
      const editorString = joinEditors(fullEditorList);
      return replaceIllegalFileNameCharactersInString(editorString);
    }
  
    function joinEditors(fullEditorList) {
      const len = fullEditorList.length;
      if (len == 1)
        return fullEditorList[0];
      else if (len == 2)
        return fullEditorList.join("\ and ");
      else if (len == 3 || len == 4)
        return fullEditorList.slice(0, -1).join("\, ") + `\, and ${fullEditorList[len - 1]}`;
      else if (len >= 5)
        return fullEditorList[0] + " et al.";
    }
  
    function titleString(citekey) {
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let titleString = data.fields.title;
      return titleString;
    }
  
    function containerString(citekey) {
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let containerString = data.containerTitle;
      return containerString;
    }
  
    function publisherString(citekey) {
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let publisherString = data.fields.publisher;
      return publisherString;
    }
  
    function pageString(citekey) {
      let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
      let pageString = data.fields.pages;
      return pageString;
    }
  
    let data = app.plugins.plugins['obsidian-citation-plugin'].library.entries[citekey].data;
    let authorString = "";
    let editorString = "";
    if (data.creators.author) {
      authorString = authorsString(citekey);
    }
    if (data.creators.editor) {
      editorString = editorsString(citekey);
    }
    let year = yearString(citekey);
    let title = titleString(citekey);
    let publisher = publisherString(citekey);
    let page = pageString(citekey);
    let container = containerString(citekey);
  
    let citationString = "";
    if (authorString) {
      citationString = `${authorString} (${year}). ${title}`;
    } else if (editorString) {
      citationString = `${editorString} (ed., ${year}). ${title}`;
    }
    if (container) {
      citationString += `. In: ${editorString} (ed., ${year}), ${container}`;
    }
    if (page) {
      const rangeRegex = /^\d+[-–—]\d+$/;
      if (rangeRegex.test(page)) {
        citationString += `, pp. ${page}.`;
      } else {
        citationString += `, p. ${page}.`;
      }
    } else {
      citationString += `.`;
    }
    if (publisher) {
      citationString += ` ${publisher}.`;
    }
    return citationString;
  }
  
  module.exports = citationString;