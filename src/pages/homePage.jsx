import './homePage.css';


function HomePage() {
    function handleAnalyze (event) {
        var text = $("#input-text").val();

          // Make a POST request to the API Gateway endpoint
          $.ajax({
            url: "<API_GATEWAY_ENDPOINT>",
            method: "POST",
            data: JSON.stringify({ text: text }),
            contentType: "application/json",
            success: function (data) {
              // Update the sentiment analysis result
              $("#sentiment-text").text(data.sentiment);
              $("#sentiment-score").text(data.score);
              $("#sentiment").show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
              alert("Error analyzing text!");
            },
          });
    }
    return (
      <div className="App">
        <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous" />
    
    <script
      src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
      integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
      crossorigin="anonymous"></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
      integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
      crossorigin="anonymous"></script>
    <script
      src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
      crossorigin="anonymous">
          
      </script>
    
    {/* <script type="text/javascript">
      $(document).ready(function () {
        $("#analyze-button").click(function () {
          // Get the user input
          var text = $("#input-text").val();

          // Make a POST request to the API Gateway endpoint
          $.ajax({
            url: "<API_GATEWAY_ENDPOINT>",
            method: "POST",
            data: JSON.stringify({ text: text }),
            contentType: "application/json",
            success: function (data) {
              // Update the sentiment analysis result
              $("#sentiment-text").text(data.sentiment);
              $("#sentiment-score").text(data.score);
              $("#sentiment").show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
              alert("Error analyzing text!");
            },
          });
        });
      });
    </script> */}

      </div>
    );
  }
  
  export default HomePage;