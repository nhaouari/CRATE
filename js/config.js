var connectionOptions = "";





// #2 get stun servers
$.ajax({
    type: "POST",
    url: "https://service.xirsys.com/ice",
    data: {
        ident: "chatwane",
        secret: "8105d907-564a-4213-8c91-21b0a2f7344b",
        domain: "crate.com",
        application: "crate",
        room: "default",
        secure: 1
    },
    success: function (addresses, status) {
        var connectionOptions = (addresses && addresses.d) ||
            {iceServers: [ {
                url: 'stun:'+config.stun, // default google ones if xirsys not
                urls: 'stun:'+config.stun } ] }; // responding
        initialize(connectionOptions);
    },
    error: function (jqXHR, textStatus, error) {
    var connectionOptions =  {iceServers: [ {
                uurl: 'stun:'+config.stun, // default google ones if xirsys not
                urls: 'stun:'+config.stun } ] }; // responding
        initialize(connectionOptions);
    },

    async: true
});
