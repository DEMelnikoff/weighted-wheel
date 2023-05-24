

const exp = (function() {


    let p = {};

    let settings = {
        nSpins: 10,
        effortOrder: ['highEffort_first', 'highEffort_second'][Math.floor(Math.random() * 2)],
        miOrder: ['highMI_first', 'highMI_second'][Math.floor(Math.random() * 2)],
    };

    console.log(settings.miOrder, settings.effortOrder);

    jsPsych.data.addProperties({
        spins_per_wheel: settings.nSpins,
        effort_order: settings.effortOrder,
        mi_order: settings.miOrder,
    });

    // define each wedge
    const wedges = {
        one: {color:"#fe0000", label:"1"},
        two: {color:"#800001", label:"2"},
        three: {color:"#fe6a00", label:"3"},
        four: {color:"#803400", label:"4"},
        five: {color:"#0094fe", label:"5"},
        six: {color:"#806b00", label:"6"},
        seven: {color:"#00fe21", label:"7"},
        eight: {color:"#007f0e", label:"8"},
        nine: {color:"#ffd800", label:"9"},
        ten: {color:"#00497e", label:"10"},
        eleven: {color:"#0026ff", label:"11"},
        twelve: {color:"#001280", label:"12"},
        thirteen: {color:"#b100fe", label:"13"},
    };

   /*
    *
    *   INSTRUCTIONS
    *
    */

    const html = {
        intro: [
            `<div class='parent'>
                <p><strong>Welcome to Spin the Wheel!</strong></p>
                <p>In Spin the Wheel, you'll spin a series of prize wheels.</p>
                <p>Each time you spin a prize wheel, you'll earn points.
                <br>The number of points you earn depends on where the wheel lands.</p>
                <p>Your goal is to earn as many points as possible!</p>
            </div>`,

            `<div class='parent'>
                <p>Spinning a prize wheel is a two-step process.</p>
                <p>First, you must build momentum by repeatedly tapping the right arrow on your keyboard.</br>
                Once you build enough momentum, you must press your spacebar to spin the wheel.</p>
                <p>To practice spinning, continue to the next page.</p>
            </div>`
        ],

        postPractice: [
            `<div class='parent'>
                <p>Practice is now complete!</p>
                <p>Soon, you'll play two rounds of Spin the Wheel.</p>
            </div>`,

            `<div class='parent'>
                <p>After each round of Spin the Wheel, you'll answer questions about your feelings.</p>
                <p>Specifically, you'll report how <strong>immersed and engaged</strong> you felt during each round,<br>
                as well as how much you <strong>enjoyed</strong> each round.</p>
            </div>`,
        ],

        postTask: [
            `<div class='parent'>
                <p>Spin the Wheel is now complete!</p>
                <p>To finish this study, please continue to answer a few final questions.</p>
            </div>`
        ],

        readyForRound1: [
            `<div class='parent'>
                <p>You're now ready to play Round 1 of Spin the Wheel!</p>
                <p>When you continue, Round 1 will begin.</p>
            </div>`
        ],

        readyForRound2: [
            `<div class='parent'>
                <p>You're now ready to play Round 2 of Spin the Wheel!</p>
                <p>When you continue, Round 2 will begin.</p>
            </div>`
        ],

        round1Complete: [
            `<div class='parent'>
                <p>Round 1 of Spin the Wheel is now complete!</p>
                <p>Continue to learn about and play round 2.</p>
            </div>`
        ],
    };

    function MakeAttnChk (settings, round) {

        const instPage_1 = {
            type: jsPsychInstructions,
            pages: [`<div class='parent'>
                <p>Remember: The goal of Spin the Wheel is win as many points as possible.</p>
                <p>The number of points you earn for each spin is equal to the number you land on.<br>
                You'll find out how many points you earned in total after both rounds are complete.</p>
                </div>`],
            show_clickable_nav: true,
            post_trial_gap: 500,
        };
        
        let text = {
            round: round == 1 ? 'first round' : 'second round',
        };

        let correctAnswers = [`Earn as many points as possible.`, `5`];

        if (settings.effortOrder == 'highEffort_first' && round == 1 || settings.effortOrder == 'highEffort_second' && round == 2) {
            text.speed1 = "<strong> as fast as possible</strong>";
            text.speed2 = "If you do not tap your right arrow as fast as possible,<br>the wheel will not build enough momentum to spin.";
            correctAnswers.push(`In round ${round}, I must tap my right arrow as fast as possible to build momentum.`);
        } else if (settings.effortOrder == 'highEffort_first' && round == 2 || settings.effortOrder == 'highEffort_second' && round == 1) {
            text.speed1 = "<strong> at a moderate pace</strong>";
            text.speed2 = "If you tap your right arrow either too quickly or too slowly,<br>the wheel will not build enough momentum to spin.";
            correctAnswers.push(`In round ${round}, I must tap my right arrow at a moderate pace to build momentum.`);
        };

        const instPage_2 = {
            type: jsPsychInstructions,
            pages: [`<div class='parent'>
                <p>In the ${text.round} of Spin the Wheel,<br>
                you'll need to tap your right arrow ${text.speed1} in order to build momentum.</p>
                <p>${text.speed2}</p>
                </div>`],
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const errorMessage = {
          type: jsPsychInstructions,
          pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand the game, please continue to re-read the instructions.</p></div>`],
          show_clickable_nav: true,
        };

        const attnChk = {
            type: jsPsychSurveyMultiChoice,
            preamble: `<div class='parent'>
                <p>Please answer the following questions.</p>
                </div>`,
            questions: [
                {
                    prompt: "What is the goal of Spin the Wheel?", 
                    name: `attnChk1_${round}`, 
                    options: [`Earn as many points as possible.`, `Spin the wheel as fast as possible.`],
                },
                {
                    prompt: "How many points is it worth when the wheel lands on a 5?", 
                    name: `attnChk2_${round}`, 
                    options: [`0`, `5`, `10`],
                },
                {
                    prompt: "Which of the following statements is true?", 
                    name: `attnChk3_${round}`, 
                    options: [`In round ${round}, I must tap my right arrow as fast as possible to build momentum.`, `In round ${round}, I must tap my right arrow at a moderate pace to build momentum.`],
                },
            ],
            scale_width: 500,
            on_finish: (data) => {
                  const totalErrors = dmPsych.getTotalErrors(data, correctAnswers);
                  data.totalErrors = totalErrors;
            },
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const instLoop = {
          timeline: [instPage_1, instPage_2, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        this.timeline = [instLoop];
    }
   

    p.practiceWheel_1 = {
        type: jsPsychCanvasButtonResponse,
        prompt: `<div class='parent'>
            <p>Repeatedly tap your right arrow to build momentum.</br>
            Once you build enough momentum, you'll see a "Ready!" message at the center of the wheel.</br>
            This means you can spin the wheel by pressing your spacebar. Once you spin the wheel, you can stop tapping your right arrow.</p>
            <p>Practice spinning by (1) tapping your right arrow and then (2) pressing your spacebar when the "Ready!" message appears.</p>
            </div>`,
        stimulus: function(c, spinnerData) {
            dmPsych.spinner(c, spinnerData, [wedges.three, wedges.three, wedges.five, wedges.five], [0, 1], [0], 1);
        },
        nSpins: 1,
        canvas_size: [500, 500],
        post_trial_gap: 500,
    };

    p.practiceWheel_2 = {
        type: jsPsychCanvasButtonResponse,
        prompt: `<div class='parent'>
            <p>Great job! Now, spin the wheel a few more time to get the hang of it. Remember:</p>
            <p>Spin the wheel by (1) tapping your right arrow and then (2) pressing your spacebar when the "Ready!" message appears.</br>
            Once you spin the wheel, you can stop tapping your right arrow.</p>
            </div>`,
        stimulus: function(c, spinnerData) {
            dmPsych.spinner(c, spinnerData, [wedges.three, wedges.three, wedges.five, wedges.five], [0, 1], [0, 0, 0], 3);
        },
        nSpins: 3,
        canvas_size: [500, 500],
    };

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.intro = {
        type: jsPsychInstructions,
        pages: html.intro,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.postPractice = {
        type: jsPsychInstructions,
        pages: html.postPractice,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.readyForRound1 = {
        type: jsPsychInstructions,
        pages: html.readyForRound1,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.readyForRound2 = {
        type: jsPsychInstructions,
        pages: html.readyForRound2,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.round1Complete = {
        type: jsPsychInstructions,
        pages: html.round1Complete,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.attnChk1 = new MakeAttnChk(settings, 1);

    p.attnChk2 = new MakeAttnChk(settings, 2);

    
   /*
    *
    *   TASK
    *
    */

    function makeTimelineVariables(settings, round) {

        // array indiciating whether or not the outcome of each spin is guaranteed
        let guaranteedOutcome = new Array(settings.nSpins).fill(0);

        // set sectors, ev, sd, and mi
        let sectors, ev, sd, mi;
        if (settings.miOrder == 'highMI_first' && round == 1 || settings.miOrder == 'highMI_second' && round == 2) {
            sectors = [ wedges.two, wedges.four, wedges.seven, wedges.ten ];
            ev = 5.75;
            sd = 3.5;
            mi = 2;
        } else if (settings.miOrder == 'highMI_first' && round == 2 || settings.miOrder == 'highMI_second' && round == 1) {
            sectors = [ wedges.four, wedges.four, wedges.four, wedges.eleven ];
            ev = 5.75;
            sd = 3.5;
            mi = .81;
        };

        // set target time between button presses
        let targetPressTime;
        if (settings.effortOrder == 'highEffort_first' && round == 1 || settings.effortOrder == 'highEffort_second' && round == 2) {
            targetPressTime = [0, .17];
        } else if (settings.effortOrder == 'highEffort_first' && round == 2 || settings.effortOrder == 'highEffort_second' && round == 1) {
            targetPressTime = [.2, .75];
        };

        let timelineVariables = [{round: round, sectors: sectors, mi: mi, ev: ev, sd: sd, targetPressTime: targetPressTime, guaranteedOutcome: guaranteedOutcome}];

        return timelineVariables;
    };

    const wheel = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            dmPsych.spinner(c, spinnerData, jsPsych.timelineVariable('sectors'), jsPsych.timelineVariable('targetPressTime'), jsPsych.timelineVariable('guaranteedOutcome'), settings.nSpins);
        },
        nSpins: settings.nSpins,
        canvas_size: [500, 500],
        post_trial_gap: 1000,
        data: {round: jsPsych.timelineVariable('round'), mi: jsPsych.timelineVariable('mi'), targetPressTime: jsPsych.timelineVariable('targetPressTime'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')},
    };


   /*
    *
    *   QUESTIONS
    *
    */

    // scales
    var zeroToExtremely = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely'];
    var zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    // constructor functions
    function MakeFlowQs(round) {
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px'>

        <p>Thank you for completing round ${round} of Spin the Wheel!</p>

        <p>During round ${round}, to what extent did you feel immersed and engaged in what you were doing?<br>
        Report the degree to which you felt immersed and engaged by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `During round ${round}, to what extent did you feel <strong>absorbed</strong> in what you were doing?`,
                name: `absorbed`,
                labels: zeroToExtremely,
                required: true,
            },
            {
                prompt: `During round ${round}, to what extent did you feel <strong>immersed</strong> in what you were doing?`,
                name: `immersed`,
                labels: zeroToExtremely,
                required: true,
            },
            {
                prompt: `During round ${round}, to what extent did you feel <strong>engaged</strong> in what you were doing?`,
                name: `engaged`,
                labels: zeroToExtremely,
                required: true,
            },
            {
                prompt: `During round ${round}, to what extent did you feel <strong>engrossed</strong> in what you were doing?`,
                name: `engrossed`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
        this.data = {round: jsPsych.timelineVariable('round'), mi: jsPsych.timelineVariable('mi'), targetPressTime: jsPsych.timelineVariable('targetPressTime'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')};
        this.on_finish =(data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEnjoyQs(round) {
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px'>

        <p>Below are a few more questions about round ${round} of Spin the Wheel.</p>

        <p>Instead of asking about immersion and engagement, these questions ask about <strong>enjoyment</strong>.<br>
        Report how much you <strong>enjoyed</strong> round ${round} by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `How much did you <strong>enjoy</strong> playing round ${round}?`,
                name: `enjoyable`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How much did you <strong>like</strong> playing round ${round}?`,
                name: `like`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How much did you <strong>dislike</strong> playing round ${round}?`,
                name: `dislike`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How much <strong>fun</strong> did you have playing round ${round}?`,
                name: `fun`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How <strong>entertaining</strong> was round ${round}?`,
                name: `entertaining`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
        this.data = {round: jsPsych.timelineVariable('round'), mi: jsPsych.timelineVariable('mi'), targetPressTime: jsPsych.timelineVariable('targetPressTime'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEffortQs(round) {
        this.type = jsPsychSurveyLikert;
        this.questions = [
            {
                prompt: `While playing round ${round} of Spin the Wheel,<br>how much effort did it feel like you were exerting?`,
                name: `effort`,
                labels: zeroToALot,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
        this.data = {round: jsPsych.timelineVariable('round'), mi: jsPsych.timelineVariable('mi'), targetPressTime: jsPsych.timelineVariable('targetPressTime'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);      
        };
    };

    // timeline: first wheel
    p.wheel_1 = {
        timeline: [wheel, new MakeFlowQs(1), new MakeEnjoyQs(1), new MakeEffortQs(1)],
        timeline_variables: makeTimelineVariables(settings, 1),
    };

    // timeline: second wheel
    p.wheel_2 = {
        timeline: [wheel, new MakeFlowQs(2), new MakeEnjoyQs(2), new MakeEffortQs(2)],
        timeline_variables: makeTimelineVariables(settings, 2),
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: function () { 
                let scoreArray = jsPsych.data.get().select('score').values;
                let totalScore = scoreArray[scoreArray.length - 1] + scoreArray[scoreArray.length - 4];
                return [`<div class='parent'>
                    <p>Spin the Wheel is now complete! You won a total of <strong>${totalScore}</strong> points!</p>
                    <p>To finish this study, please continue to answer a few final questions.</p>
                    </div>`];
            },  
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const meanOfEffScale = ['-2<br>Strongly<br>Disagree', '-1<br>Disagree', '0<br>Neither agree<br>nor disagree', '1<br>Agree', '2<br>Strongly<br>Agree'];

        const meanOfEff = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>Please answer the following questions as honestly and accurately as possible.</p>
                </div>`,
            questions: [
                {
                    prompt: `Pushing myself helps me see the bigger picture.`,
                    name: `meanOfEff_1`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I often don't understand why I am working so hard.`,
                    name: `meanOfEff_2r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I learn the most about myself when I am trying my hardest.`,
                    name: `meanOfEff_3`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Things make more sense when I can put my all into them.`,
                    name: `meanOfEff_4`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I work hard, it rarely makes a difference.`,
                    name: `meanOfEff_5r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, what I'm doing feels important.`,
                    name: `meanOfEff_6`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, I feel like I'm part of something bigger than me.`,
                    name: `meanOfEff_7`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Doing my best gives me a clear purpose in life.`,
                    name: `meanOfEff_8`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I try my hardest, my life has meaning.`,
                    name: `meanOfEff_9`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I exert myself, I feel connected to my ideal life.`,
                    name: `meanOfEff_10`,
                    labels: meanOfEffScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [
                {
                    prompt: "Age:", 
                    name: "age",
                    required: true,
                }
            ],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your race / ethnicity?</p>',
            html: `<div style="text-align: left">
            <p>White / Caucasian <input name="ethnicity" type="radio" value="white"/></p>
            <p>Black / African American <input name="ethnicity" type="radio" value="black"/></p>
            <p>East Asian (e.g., Chinese, Korean, Vietnamese, etc.) <input name="ethnicity" type="radio" value="east-asian"/></p>
            <p>South Asian (e.g., Indian, Pakistani, Sri Lankan, etc.) <input name="ethnicity" type="radio" value="south-asian"/></p>
            <p>Latino / Hispanic <input name="ethnicity" type="radio" value="hispanic"/></p>
            <p>Middle Eastern / North African <input name="ethnicity" type="radio" value="middle-eastern"/></p>
            <p>Indigenous / First Nations <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Bi-racial <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Other <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.ethnicity = data.response.ethnicity;
                data.other = data.response.other;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 


        const demos = {
            timeline: [taskComplete, meanOfEff, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "t8nYT1UtkLUW",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.intro, exp.practiceWheel_1, exp.practiceWheel_2, exp.postPractice, exp.attnChk1, exp.readyForRound1, exp.wheel_1, 
    exp.round1Complete, exp.attnChk2, exp.readyForRound2, exp.wheel_2, 
    exp.demographics, exp.save_data];

jsPsych.run(timeline);
