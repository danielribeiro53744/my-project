import emailjs from '@emailjs/browser';

export const sendEmail = (subject: string, to: string, text: string) => {
    
  emailjs.send(process.env.EMAILJS_SERVICE_ID || '', process.env.EMAILJS_TEMPLATE_ID || '', 
      {
      subject,
      to,
      text
      }
      , process.env.EMAILJS_PUBLIC_KEY || '')
      .then((result) => {
          console.log(result)
      }, (error) => {
          console.log(error.text);
      });
};