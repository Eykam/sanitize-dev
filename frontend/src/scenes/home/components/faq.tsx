import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import "../css/FAQ.css";
import Toggle from "../../utils/components/toggle";
import { componentIDs } from "../../../store/features/formSlice";

const FAQ = () => {
  const FAQs: { [index: string]: string } = {
    "Q: What is Sanitize.gg?":
      "A. Sanitize.gg is a content moderation platform for media. We use innovative AI technology to detect and censor any words or content that may violate the policies of your intended platform",
    "Q: Is Sanitize.gg free to use?":
      "A: Yes, it is 100% free. We currently limit file size to 100mb due to hardware limitations. We are currently working on a subscription service to provide unlimited file size, along with much faster editing speeds.",
    "Q: What types of files are accepted to be transcribed?":
      "Acceptable file formats are: [video/mov, video/quicktime, video/mp4, video/mpeg, video/x-msvideo, audio/wav, audio/mpeg, audio/x-wav, audio/aac, audio/webm, video/webm].\n**Files must be under 100MB**",
    "Q: How does Sanitize.gg work?":
      "A: Users submit their media to our platform and our advanced AI algorithms quickly scan and censor any potentially problematic content. The sanitized media is then returned to the user, ready to be uploaded and shared.",
    "Q: Who can benefit from using Sanitize.gg?":
      "A: Sanitize.gg is perfect for video editors who need to carefully monitor and moderate their content for social media, streaming platforms, or any other web-based application.",
    "Q: Can Sanitize.gg be used for any platform?":
      "A: Our Algorithms are optimized for most social media platform content policies.",
    "Q: Why is my form not loading detected words and timestamps?":
      "A. Due to the variability in audio quality, sometimes errors occur. Try submitting your file again!",
  };

  const metrics: string[] = [
    "1000 GB\nof files processed",
    "15,000 Hours\nof audio Scrubbed",
    "300,000 Words\ncensored",
  ];

  const checkSmaller = () => {
    return window.innerWidth <= 1500;
  };

  const checkMobile = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  const expand = (currWord: string) => {
    if (currWord !== "") {
      const answer = document.getElementById("answer" + currWord);
      if (answer) {
        if (answer.style.display === "none") answer.style.display = "block";
        else if (answer.style.display === "block")
          answer.style.display = "none";
      }
    }
  };

  return (
    <Toggle id={componentIDs.FAQ}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          width: "100vw",
          maxWidth: "100vw",
          minHeight: "50vh",
          color: "lightgray",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "50vh",
            margin: "0",
            marginBottom: "4%",
            background: "rgb(80, 80, 80)",
            padding: "5% 2%",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              margin: "auto",
              width: checkMobile() ? "100%" : "65%",
            }}
          >
            {metrics.map((currMetric) => {
              return (
                <div
                  className="metric"
                  key={currMetric}
                  style={{
                    flexDirection: checkSmaller() ? "column" : "row",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: checkMobile() ? "100%" : "200%",
                      color: "white",
                      margin: "1%",
                    }}
                  >
                    {currMetric.split("\n")[0]}
                  </p>

                  <p>{currMetric.split("\n")[1]}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: checkMobile() ? "90%" : "65%",
            margin: "auto",
            marginBottom: "2%",
          }}
        >
          <h2> FAQ </h2>
          <div style={{ width: "100%" }}>
            {Object.keys(FAQs).map((question) => {
              return (
                <div style={{ display: "block" }} key={question}>
                  <div
                    id={"question-" + question}
                    style={{ cursor: "pointer" }}
                    className="faq-questions"
                    onClick={() => {
                      expand(question);
                    }}
                  >
                    <h5>{question}</h5>
                  </div>

                  <h5
                    id={"answer" + question}
                    style={{ display: "none", margin: "2% 1%" }}
                  >
                    {FAQs[question]}
                  </h5>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Toggle>
  );
};

export default FAQ;
