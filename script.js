function boldifyText(text) {
  var words = text.split(" ");
  var output = "";

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word.length > 0) {
      var boldWord = "<b>";
      for (var j = 0; j < Math.ceil(word.length / 2); j++) {
        boldWord += word.charAt(j);
      }
      boldWord += "</b>" + word.slice(Math.ceil(word.length / 2));
      output += boldWord + " ";
    }
  }

  return output.trim();
}

function boldify() {
  var inputText = document.getElementById("input-text").value;
  var inputFile = document.getElementById("input-file").files[0];

  if (inputText) {
    var boldifiedText = boldifyText(inputText);
    document.getElementById("output-text").innerHTML = boldifiedText;
  } else if (inputFile) {
    var fileReader = new FileReader();
  
    fileReader.onload = function (event) {
      var fileContent = event.target.result;
  
      if (inputFile.type === "application/pdf") {
        pdfjsLib.getDocument({ data: fileContent }).promise.then(function (pdf) {
          var numPages = pdf.numPages;
          var extractedText = "";
  
          function extractPageText(pageNumber) {
            if (pageNumber > numPages) {
              var boldifiedText = boldifyText(extractedText);
              document.getElementById("output-text").innerHTML = boldifiedText;
              return;
            }
  
            pdf.getPage(pageNumber).then(function (page) {
              page.getTextContent().then(function (textContent) {
                var pageText = textContent.items
                  .map(function (item) {
                    return item.str;
                  })
                  .join(" ");
  
                extractedText += pageText + " ";
                extractPageText(pageNumber + 1);
              });
            });
          }
  
          extractPageText(1);
        });
      } else if (
        inputFile.type === "application/msword" ||
        inputFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var arrayBuffer = e.target.result;
          var converted = mammoth.extractRawText({ arrayBuffer: arrayBuffer });
          converted.then(function (result) {
            var boldifiedText = boldifyText(result.value);
            document.getElementById("output-text").innerHTML = boldifiedText;
  
          });
        };
        reader.readAsArrayBuffer(inputFile);
      }
    };
  
    fileReader.readAsArrayBuffer(inputFile);
  }
}  