import PdfPrinter from "pdfmake";
import imageDataURI from "image-data-uri";
import fs from "fs-extra";


export const gettingpdfwithcontent = async(data) => {

    const imgDataUri = await imageDataURI.encodeFromURL(data.image)
    const fonts = {
        Roboto:{
            normal: "Helvetica",
            //bold: "Helvetica-bold"
        },
    }
    
    const docDefinition = {
        pageMargins: [ 40, 60, 40, 60 ],
        pageNumber: 1,
        content: [
            'Here is your Bio-Data',
            {
                alignment: 'justify',
                columns: [
                    {
                        image: imgDataUri,
                        width: 150,
                        height: 150 
                    },
                    {
                        text: [
                            {text: data.name, fontSize: 15},
                            {text: data.surname, fontSize: 15}
                        ],
                       
                    }
                ]
            }
        ],
            // {
            //     image: imgDataUri,
            //     width: 150,
            //     height: 150
            // },
            // {
            //     text: [
                    
            //         {text: data.name, fontSize: 15},
            //         {text: data.surname, fontSize: 15}
            //     ],
            //     // text: data.name,
            //      //style: 'header'
            // },
            // {
            //     text: data.email,
            //     style: 'basic'
            // },{text: data.surname},{text: data.bio},],
        styles: {
            header: {
                fontSize: 38,
            },
            basic: {
                fontSize: 24,
            }
        }

    }
    
    const printer = new PdfPrinter(fonts)
    
    const pdfReadableStream =printer.createPdfKitDocument(docDefinition, {})
   // pdfReadableStream.pipe(fs.createWriteStream(`./src/services/profiles/sample.pdf`));
    pdfReadableStream.end()

    return pdfReadableStream;

}