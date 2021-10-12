import PdfPrinter from "pdfmake";


export const gettingpdfwithcontent = (data) => {

    const fonts = {
        Roboto: {
            normal: "Helvetica",
            bold: "Helvetica-bold"
        },
    }

    const docDefination = {
        content= data,
    }

    const printer = new PdfPrinter(fonts)

    const pdfReadableStream = printer.createPdfKitDocument(docDefination)

    pdfReadableStream.end()

}