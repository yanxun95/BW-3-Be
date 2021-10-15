import PdfPrinter from "pdfmake";
import imageDataURI from "image-data-uri";
import fs from "fs-extra";


export const gettingpdfwithcontent = async(data) => {
   
    const imgDataUri = await imageDataURI.encodeFromURL(data.image)
    const fonts = {
        Roboto:{
            normal: "Helvetica",
        },
    }
    
    const docDefinition = {
        pageMargins: [ 40, 50, 40, 60 ],
        pageNumber: 1,
       content: [
       { style: 'header',
           text: `Hello ${data.name}!!   verify your details: \n\n\n\n`,},
           {
            alignment: 'justify',
               styles: 'bigger',
               columns: [
                   
                    {
                        image: imgDataUri,
                           width: 150,
                           height: 150 
                    },
                    [
                        {
                            
                            width: 'auto',
                            text: `Name : ${data.name}\n\n`,
                            style: 'header'
                        },
                        {
                            width: 'auto',
                            text: `Surname : ${data.surname}\n\n`,
                            style: 'header'
                        },
                        {
                            width: 'auto',
                            text: `E-mail : ${data.email}\n\n`,
                            style: 'header'
                        },
                        {
                            width: '*',
                            text: `Bio : ${data.bio}\n\n`,
                            style: 'header'
                        },
                
                        {
                            text: [
                                {text: ' Experiences :\n\n', fontSize: 20},
                                {
                                    text: `Role : ${data.experiences[0].role}\n\n`,
                                    style: 'header'
                                },
                                {
                                    text: `Company : ${data.experiences[0].company}`,
                                    style: 'header'
                                }
                            ]
                        }
                    ]
               ],
               columnGap: 40
           }

       ],
          
        styles: {
            header: {
                fontSize: 22,
            },
            basic: {
                fontSize: 24,
            },
            bigger: {
                fontSize: 15,
                italics: true
            },
          
        }
    
    }
    
    const printer = new PdfPrinter(fonts)
    
    const pdfReadableStream =printer.createPdfKitDocument(docDefinition, {})
    pdfReadableStream.end()

    return pdfReadableStream;

}