import * as SMTP from "../lib";

(async () => {

    const sender = SMTP.createServerSender([
        "example.com"
    ]);

    await sender.send({
        from: {
            "address": "angus@example.com",
            "name": "Angus"
        },
        to: [{
            "address": "mick@abcdefg.com",
            "name": "Mick"
        }],
        cc: [],
        subject: "hello Mick",
        body: "How are you?",
        format: SMTP.EFormat.TEXT
    });

})();
