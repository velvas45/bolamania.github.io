const webPush = require('web-push');

const vapidKeys = {
  "publicKey": "BPqhxpEooY8KZzdHTdOhUnhwrgcf-Cj9FFEcRuRiS0x9IJK5w7FGQejvKNIHsV1g9pGNQxNKHOD8HSBguprIji8",
  "privateKey": "PGrk5nzXIY5KsK7XY6bnsE8GZSDZj_FxsYFYbUyWtIs"
};

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {
  "endpoint": "https://fcm.googleapis.com/fcm/send/f7zh9Qeepv4:APA91bGHLoukRjD-tvVjcVU8HyAOGOKzHxsTDlynOJ5ZrmpurxJdfVhedJTwtmctJ5ig9itRn7-kynCT2XGF8EgEEs7vsVxEXi7QYro8Rz-0G3_YuBHSG-C0qywsCLOGDz_FP8Cbqm5m",
"keys": {
    "p256dh": "BBCdFwXYXCGnvs5+Fmltl5XFgT6de6n+63WY9PlShnKeiRKl5L6VdpwpmSD5mgP4BNS5XfG5jt+f8cwyvLgOmTE=",
    "auth": "bWGrD1kN0SfAjPh0cznZ9w=="
  }
}

const payload = "Selamat datang pada website Bola Manias";

const options = {
  gcmAPIKey: '1016156317375',
  TTL: 60,
};
webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
