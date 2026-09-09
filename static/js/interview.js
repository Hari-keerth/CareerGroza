/*=========================================================
 CareerGrowza AI Mock Interview
 interview.js
=========================================================*/

"use strict";


/*=========================================================
    MODULE 1 — DOM
=========================================================*/

const setupSection =
    document.getElementById("setupSection");

const interviewSection =
    document.getElementById("interviewSection");

const reportSection =
    document.getElementById("reportSection");


const questionNo =
    document.getElementById("questionNo");

const questionText =
    document.getElementById("interviewQuestion");


const answerBox =
    document.getElementById("answer");


const timer =
    document.getElementById("timer");


const progressFill =
    document.getElementById("progressFill");

const progressPercent =
    document.getElementById("progressPercent");

const progressText =
    document.getElementById("progressText");


const difficultyBadge =
    document.getElementById("difficultyBadge");

const difficultyText =
    document.getElementById("difficultyText");


const roleText =
    document.getElementById("roleText");

const sidebarDifficulty =
    document.getElementById("sidebarDifficulty");

const sidebarQuestions =
    document.getElementById("sidebarQuestions");


const wordCount =
    document.getElementById("wordCount");


const jobRoleInput =
    document.getElementById("jobRole");

const roleSearchBox =
    document.getElementById("roleSearchBox");

const roleSearchResults =
    document.getElementById("roleSearchResults");


/*=========================================================
    MODULE 2 — INTERVIEW STATE
=========================================================*/

let currentQuestion = 0;

let totalQuestions = 0;

let role = "";

let difficulty = "";

let questions = [];

let answers = [];

let timerInterval = null;

let remainingSeconds = 1800;


/*=========================================================
    MODULE 3 — ROLE SEARCH
=========================================================*/

const ROLE_SUGGESTIONS = [];

let roleActiveIndex = -1;


function renderRoleSuggestions(matches) {

    roleSearchResults.innerHTML = "";

    if (!matches.length) {

        const customRole =
            jobRoleInput.value.trim();

        if (customRole !== "") {

            const item =
                document.createElement("div");

            item.className =
                "search-item";

            item.innerHTML = `
                <strong>Use custom role:</strong><br>
                ${customRole}
            `;

            item.addEventListener(
                "mousedown",
                (e) => {

                    e.preventDefault();

                    selectRole(customRole);

                }
            );

            roleSearchResults.innerHTML = "";

            roleSearchResults.appendChild(item);

            roleSearchResults.classList.remove(
                "hidden"
            );

        } else {

            roleSearchResults.classList.add(
                "hidden"
            );

        }

        return;
    }


    matches.forEach((role, index) => {

        const item =
            document.createElement("div");

        item.className =
            "search-item";

        item.textContent =
            role;

        item.dataset.index =
            index;


        item.addEventListener(
            "mousedown",
            (e) => {

                e.preventDefault();

                selectRole(role);

            }
        );


        roleSearchResults.appendChild(item);

    });


    roleActiveIndex = -1;

    roleSearchResults.classList.remove(
        "hidden"
    );

}


function getFilteredRoles() {

    const query =
        jobRoleInput.value
            .trim()
            .toLowerCase();


    if (!query) {

        return ROLE_SUGGESTIONS;

    }


    return ROLE_SUGGESTIONS.filter(
        role =>
            role
                .toLowerCase()
                .includes(query)
    );

}


function selectRole(role) {

    jobRoleInput.value =
        role;

    roleSearchResults.classList.add(
        "hidden"
    );

    roleActiveIndex = -1;

}


function highlightRole(index) {

    const items =
        roleSearchResults.querySelectorAll(
            ".search-item"
        );


    items.forEach(item => {

        item.classList.remove("active");

    });


    if (
        index >= 0 &&
        index < items.length
    ) {

        items[index].classList.add(
            "active"
        );

        items[index].scrollIntoView({
            block: "nearest"
        });

    }

}


if (
    jobRoleInput &&
    roleSearchResults
) {

    jobRoleInput.addEventListener(
        "focus",
        () => {

            renderRoleSuggestions(
                getFilteredRoles()
            );

        }
    );


    jobRoleInput.addEventListener(
        "input",
        () => {

            renderRoleSuggestions(
                getFilteredRoles()
            );

        }
    );


    jobRoleInput.addEventListener(
        "keydown",
        (e) => {

            const items =
                roleSearchResults.querySelectorAll(
                    ".search-item"
                );


            if (!items.length) {

                return;

            }


            if (e.key === "ArrowDown") {

                e.preventDefault();

                roleActiveIndex =
                    Math.min(
                        roleActiveIndex + 1,
                        items.length - 1
                    );

                highlightRole(
                    roleActiveIndex
                );

            }


            else if (
                e.key === "ArrowUp"
            ) {

                e.preventDefault();

                roleActiveIndex =
                    Math.max(
                        roleActiveIndex - 1,
                        0
                    );

                highlightRole(
                    roleActiveIndex
                );

            }


            else if (
                e.key === "Enter"
            ) {

                if (
                    roleActiveIndex >= 0
                ) {

                    e.preventDefault();

                    selectRole(
                        items[
                            roleActiveIndex
                        ].textContent
                    );

                } else {

                    roleSearchResults.classList.add(
                        "hidden"
                    );

                }

            }


            else if (
                e.key === "Escape"
            ) {

                roleSearchResults.classList.add(
                    "hidden"
                );

            }

        }
    );


    document.addEventListener(
        "click",
        (e) => {

            if (
                roleSearchBox &&
                !roleSearchBox.contains(
                    e.target
                )
            ) {

                roleSearchResults.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/*=========================================================
    CSRF
=========================================================*/

function getCSRFToken() {

    return (
        document.querySelector(
            "[name=csrfmiddlewaretoken]"
        )?.value || ""
    );

}


/*=========================================================
    MODULE 4 — TIMER
=========================================================*/

function startTimer() {

    clearInterval(
        timerInterval
    );


    remainingSeconds =
        30 * 60;


    updateTimer();


    timerInterval =
        setInterval(() => {

            remainingSeconds--;

            updateTimer();


            if (
                remainingSeconds <= 0
            ) {

                clearInterval(
                    timerInterval
                );

                evaluateInterview();

            }

        }, 1000);

}


function updateTimer() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/*=========================================================
    MODULE 5 — PROGRESS
=========================================================*/

function updateProgress() {

    const percent =
        (
            currentQuestion /
            totalQuestions
        ) * 100;


    progressFill.style.width =
        percent + "%";


    progressPercent.textContent =
        Math.round(percent) + "%";


    progressText.textContent =
        `${currentQuestion}/${totalQuestions}`;


    sidebarQuestions.textContent =
        `${currentQuestion}/${totalQuestions}`;

}


/*=========================================================
    MODULE 6 — SIDEBAR
=========================================================*/

function updateSidebar() {

    roleText.textContent =
        role;


    difficultyText.textContent =
        difficulty;


    sidebarDifficulty.textContent =
        difficulty;


    difficultyBadge.textContent =
        difficulty;

}


/*=========================================================
    MODULE 11 — WORD COUNTER
=========================================================*/

answerBox.addEventListener(
    "input",
    () => {

        const words =
            answerBox.value
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        wordCount.textContent =
            `${words.length} Words`;

    }
);


/*=========================================================
    START INTERVIEW
=========================================================*/

document
    .getElementById("startInterview")
    .addEventListener(
        "click",
        startInterview
    );


function startInterview() {

    role =
        document
            .getElementById("jobRole")
            .value
            .trim();


    difficulty =
        document
            .getElementById("difficulty")
            .value;


    totalQuestions =
        parseInt(
            document
                .getElementById(
                    "totalQuestions"
                )
                .value,
            10
        );


    currentQuestion = 0;

    questions = [];

    answers = [];


    updateSidebar();

    updateProgress();

    startTimer();


    setupSection.style.display =
        "none";


    interviewSection.style.display =
        "grid";


    reportSection.style.display =
        "none";


    loadQuestion();

}


/*=========================================================
    MODULE 7 — QUESTION GENERATION
=========================================================*/

let isLoadingQuestion = false;


async function loadQuestion() {

    if (isLoadingQuestion) {

        return;

    }


    isLoadingQuestion = true;


    const nextButton =
        document.getElementById(
            "nextBtn"
        );


    const skipButton =
        document.getElementById(
            "skipBtn"
        );


    if (nextButton) {

        nextButton.disabled =
            true;

    }


    if (skipButton) {

        skipButton.disabled =
            true;

    }


    /*
        IMPORTANT:
        This is the loading text.
    */

    questionText.textContent =
        "Generating AI Question...";


    answerBox.value = "";


    try {

        const response =
            await fetch(
                "/interview/question/",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCSRFToken()

                    },

                    body:
                        JSON.stringify({

                            role:
                                role,

                            difficulty:
                                difficulty,

                            total_questions:
                                totalQuestions,

                            asked_questions:
                                questions

                        })

                }
            );


        console.log(
            "Question HTTP Status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Question API:",
            data
        );


        /*
            Check HTTP status.
        */

        if (!response.ok) {

            throw new Error(
                data.error ||
                `Question API failed (${response.status})`
            );

        }


        /*
            Check Django success.
        */

        if (!data.success) {

            alert(
                data.error ||
                "Unable to generate question."
            );


            if (
                data.error &&
                data.error
                    .toLowerCase()
                    .includes(
                        "limit reached"
                    )
            ) {

                clearInterval(
                    timerInterval
                );

                evaluateInterview();

            }


            return;

        }


        /*
            Make sure question exists.
        */

        if (
            !data.question ||
            typeof data.question !== "string"
        ) {

            alert(
                "Question not received."
            );

            console.log(
                "Invalid question response:",
                data
            );

            return;

        }


        /*
            Store generated question.
        */

        currentQuestion++;

        questions.push(
            data.question
        );


        /*
            Update question number.
        */

        questionNo.textContent =
            `Question ${currentQuestion} of ${totalQuestions}`;


        /*
            IMPORTANT QUESTION DISPLAY FIX
        */

        console.log(
            "Setting question element:",
            questionText
        );


        console.log(
            "Question received:",
            data.question
        );


        questionText.textContent =
            data.question;


        /*
            Verify the DOM immediately.
        */

        console.log(
            "Question element after update:",
            questionText.textContent
        );


        /*
            Verify again on the next browser paint.
        */

        requestAnimationFrame(
            () => {

                if (
                    questionText.textContent !==
                    data.question
                ) {

                    console.warn(
                        "Question text was changed after API update. Restoring it."
                    );


                    questionText.textContent =
                        data.question;

                }

            }
        );


        /*
            Update progress and tracker.
        */

        updateProgress();

        updateQuestionTracker();


        /*
            Reset answer area.
        */

        answerBox.value = "";

        wordCount.textContent =
            "0 Words";

    }


    catch (error) {

        console.error(
            "Question API Error:",
            error
        );


        questionText.textContent =
            "Unable to load question.";


        alert(
            error.message ||
            "Unable to connect to server."
        );

    }


    finally {

        isLoadingQuestion =
            false;


        if (nextButton) {

            nextButton.disabled =
                false;

        }


        if (skipButton) {

            skipButton.disabled =
                false;

        }

    }

}


/*=========================================================
    MODULE 12 — SUBMIT ANSWER
=========================================================*/

document
    .getElementById("nextBtn")
    .addEventListener(
        "click",
        submitAnswer
    );


function submitAnswer() {

    const answer =
        answerBox.value.trim();


    answers.push({

        question:
            questions[
                currentQuestion - 1
            ],

        answer:
            answer

    });


    if (
        currentQuestion >=
        totalQuestions
    ) {

        clearInterval(
            timerInterval
        );


        evaluateInterview();


        return;

    }


    loadQuestion();

}


/*=========================================================
    MODULE 13 — SKIP QUESTION
=========================================================*/

document
    .getElementById("skipBtn")
    .addEventListener(
        "click",
        skipQuestion
    );


function skipQuestion() {

    answers.push({

        question:
            questions[
                currentQuestion - 1
            ],

        answer:
            ""

    });


    if (
        currentQuestion >=
        totalQuestions
    ) {

        clearInterval(
            timerInterval
        );


        evaluateInterview();


        return;

    }


    loadQuestion();

}


/*=========================================================
    MODULE 8 — QUESTION TRACKER
=========================================================*/

function updateQuestionTracker() {

    const tracker =
        document.getElementById(
            "questionTracker"
        );


    if (!tracker) {

        return;

    }


    tracker.innerHTML = "";


    for (
        let i = 1;
        i <= totalQuestions;
        i++
    ) {

        let status = "";


        if (
            i < currentQuestion
        ) {

            status =
                "completed";

        }


        else if (
            i === currentQuestion
        ) {

            status =
                "active";

        }


        tracker.innerHTML += `

            <div class="tracker-item ${status}">

                <span>
                    Question ${i}
                </span>

            </div>

        `;

    }

}


/*=========================================================
    MODULE 9 — SPEECH / READ QUESTION
=========================================================*/

const readButton =
    document.getElementById(
        "readQuestion"
    );


if (readButton) {

    readButton.addEventListener(
        "click",
        () => {

            speechSynthesis.cancel();


            const speech =
                new SpeechSynthesisUtterance(
                    questionText.innerText
                );


            speech.rate =
                1;


            speech.pitch =
                1;


            speech.lang =
                "en-US";


            speechSynthesis.speak(
                speech
            );

        }
    );

}


/*=========================================================
    MODULE 10 — VOICE RECOGNITION
=========================================================*/

let recognition = null;


if (
    "webkitSpeechRecognition"
    in window
) {

    recognition =
        new webkitSpeechRecognition();


    recognition.continuous =
        true;


    recognition.interimResults =
        true;


    recognition.lang =
        "en-US";


    recognition.onresult =
        function(event) {

            let transcript =
                "";


            for (
                let i =
                    event.resultIndex;

                i <
                    event.results.length;

                i++
            ) {

                transcript +=
                    event.results[i][0]
                        .transcript;

            }


            answerBox.value =
                transcript;


            answerBox.dispatchEvent(
                new Event("input")
            );

        };

}


const startRecording =
    document.getElementById(
        "startRecording"
    );


const stopRecording =
    document.getElementById(
        "stopRecording"
    );


if (
    startRecording &&
    recognition
) {

    startRecording.addEventListener(
        "click",
        () => {

            recognition.start();

        }
    );

}


if (
    stopRecording &&
    recognition
) {

    stopRecording.addEventListener(
        "click",
        () => {

            recognition.stop();

        }
    );

}


/*=========================================================
    MODULE 14 — EVALUATION
=========================================================*/

async function evaluateInterview() {

    try {

        const payload = {

            role:
                role,

            difficulty:
                difficulty,

            interview_data:
                answers

        };


        console.log(
            "Evaluation Payload:",
            payload
        );


        const response =
            await fetch(
                "/interview/evaluate/",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-CSRFToken":
                            getCSRFToken()

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        console.log(
            "HTTP Status:",
            response.status
        );


        const text =
            await response.text();


        console.log(
            "Raw Server Response:"
        );


        console.log(text);


        let data;


        try {

            data =
                JSON.parse(text);

        }


        catch (e) {

            throw new Error(
                "Server returned invalid JSON.\n\n" +
                text
            );

        }


        console.log(
            "Evaluation API:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Interview evaluation failed."
            );

        }


        if (
            data.success === false
        ) {

            throw new Error(
                data.error ||
                "Interview evaluation failed."
            );

        }


        interviewSection.style.display =
            "none";


        reportSection.style.display =
            "block";


        renderReport(data);

    }


    catch (error) {

        console.error(
            "Evaluation Error:",
            error
        );


        alert(
            error.message
        );

    }

}


/*=========================================================
    MODULE 15 — REPORT RENDERING
=========================================================*/

function renderReport(data) {

    if (!data) {

        alert(
            "No report received."
        );

        return;

    }


    console.log(
        "Rendering Report:",
        data
    );


    /*-------------------------------
        Score
    -------------------------------*/

    const score =
        Number(
            data.overall_score ??
            data.score ??
            0
        );


    animateScore(score);


    /*-------------------------------
        Strengths
    -------------------------------*/

    const strengths =
        document.getElementById(
            "strengthList"
        );


    if (strengths) {

        strengths.innerHTML =
            "";


        (
            data.strengths ||
            []
        ).forEach(
            item => {

                strengths.innerHTML +=
                    `<li>${escapeHTML(String(item))}</li>`;

            }
        );

    }


    /*-------------------------------
        Improvements
    -------------------------------*/

    const improvements =
        document.getElementById(
            "improvementList"
        );


    if (improvements) {

        improvements.innerHTML =
            "";


        (
            data.improvements ||
            []
        ).forEach(
            item => {

                improvements.innerHTML +=
                    `<li>${escapeHTML(String(item))}</li>`;

            }
        );

    }


    /*-------------------------------
        Review Table
    -------------------------------*/

    const table =
        document.getElementById(
            "reviewTable"
        );


    if (table) {

        table.innerHTML =
            "";


        (
            data.reviews ||
            []
        ).forEach(
            (review, index) => {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHTML(
                                String(
                                    review.score ??
                                    "-"
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                String(
                                    review.feedback ??
                                    "-"
                                )
                            )}
                        </td>

                    </tr>

                `;

            }
        );

    }


    /*-------------------------------
        Study Plan
    -------------------------------*/

    const study =
        document.getElementById(
            "recommendationList"
        );


    if (study) {

        study.innerHTML =
            "";


        (
            data.study_plan ||
            []
        ).forEach(
            item => {

                study.innerHTML +=
                    `<li>${escapeHTML(String(item))}</li>`;

            }
        );

    }

}


/*=========================================================
    MODULE 16 — SCORE ANIMATION
=========================================================*/

function animateScore(score) {

    const circle =
        document.getElementById(
            "overallScore"
        );


    if (!circle) {

        return;

    }


    let current =
        0;


    const interval =
        setInterval(
            () => {

                current++;


                circle.textContent =
                    current;


                if (
                    current >= score
                ) {

                    clearInterval(
                        interval
                    );

                }

            },
            20
        );

}


/*=========================================================
    MODULE 17 — DOWNLOAD REPORT
=========================================================*/

const downloadButton =
    document.getElementById(
        "downloadReport"
    );


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/*=========================================================
    MODULE 18 — RETRY / RETAKE
=========================================================*/

const retryButton =
    document.getElementById(
        "retakeInterview"
    );


if (retryButton) {

    retryButton.addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );


            currentQuestion =
                0;


            questions =
                [];


            answers =
                [];


            answerBox.value =
                "";


            wordCount.textContent =
                "0 Words";


            progressFill.style.width =
                "0%";


            progressPercent.textContent =
                "0%";


            progressText.textContent =
                "0/0";


            questionNo.textContent =
                "Question 0 of 0";


            questionText.textContent =
                "Loading Question...";


            reportSection.style.display =
                "none";


            setupSection.style.display =
                "block";

        }
    );

}


/*=========================================================
    OPTIONAL — SPEAK RESULT
=========================================================*/

function speakResult(score) {

    if (
        !(
            "speechSynthesis"
            in window
        )
    ) {

        return;

    }


    const speech =
        new SpeechSynthesisUtterance(

            `Interview completed.
             Your score is ${score} percent.`

        );


    speech.rate =
        1;


    speech.pitch =
        1;


    speech.lang =
        "en-US";


    speechSynthesis.speak(
        speech
    );

}


/*=========================================================
    ESCAPE HTML
=========================================================*/

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/*=========================================================
    MODULE 19 — CLEANUP
=========================================================*/

window.addEventListener(
    "beforeunload",
    () => {

        clearInterval(
            timerInterval
        );


        if (
            "speechSynthesis"
            in window
        ) {

            speechSynthesis.cancel();

        }

    }
);


/*=========================================================
    DEBUG
=========================================================*/

console.log(
    "CareerGrowza Interview Loaded Successfully"
);