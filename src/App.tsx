import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaRegFilePdf, FaGithub } from "react-icons/fa6";
import jsPDF from "jspdf";

const App = () => {
    const [fileName, setFileName] = useState(String);
    const [images, setImages] = useState<File[]>([]); //images array
    const [imagesAdded, setImagesAdded] = useState(false); // check if images are added

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setImagesAdded(true);
            const fileArray = Array.from(files);
            setImages(fileArray);
        }
        // console.log(images);
    };
    const handleFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };

    const handleGeneratePdf = () => {
        if (images.length === 0) {
            alert("No images to convert!");
            return;
        }

        const pdf = new jsPDF("p", "mm");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const loadImagePromises = images.map((image) => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.src = URL.createObjectURL(image);
                img.onload = () => resolve(img);
            });
        });

        Promise.all(loadImagePromises).then((loadedImages) => {
            loadedImages.forEach((img, index) => {
                const ratio = pageWidth / img.width;
                const imgWidth = pageWidth * 0.98;
                const imgHeight = img.height * ratio * 0.98;

                if (imgHeight > pageHeight) {
                    // Scale down further if image height exceeds page height
                    const scale = pageHeight / imgHeight;
                    pdf.addImage(
                        img,
                        "JPEG",
                        (pageWidth - imgWidth * scale) / 2, // Center horizontally
                        0,
                        imgWidth * scale,
                        imgHeight * scale
                    );
                } else {
                    pdf.addImage(
                        img,
                        "JPEG",
                        (pageWidth - imgWidth) / 2, // Center horizontally
                        (pageHeight - imgHeight) / 2, // Center vertically
                        imgWidth,
                        imgHeight
                    );
                }

                // Add a new page if it's not the last image
                if (index < loadedImages.length - 1) {
                    pdf.addPage();
                }
            });

            // Save the PDF
            const filename =
                fileName.trim() === ""
                    ? "image-to-pdf.pdf"
                    : `${fileName.trim()}.pdf`;
            pdf.save(filename);

            console.log("PDF generated");
        });
    };

    return (
        <>
            <div className=" fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
            <div className="m-6 mb-9 pt-[6rem] md:px-6 relative flex flex-col justify-center items-center content-center flex-wrap  text-white w-[100%] lg:w-[900px] bg-[#ffffff2d] min-h-[85vh] rounded-3xl">
                <div className="flex absolute top-[20px] right-[50%] translate-x-[50%]">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-10 h-auto"
                    />
                    <h1 className=" text-3xl font-extrabold md:font-semibold  whitespace-nowrap">
                        &nbsp;Image to PDF
                    </h1>
                </div>
                <div>
                    <label
                        htmlFor="fileInput"
                        className={`bg-[#a6c8fe87] flex font-bold md:font-normal py-3 px-4 rounded-md cursor-pointer transition-all duration-150 hover:scale-105`}
                    >
                        <span>Upload Images &nbsp;</span>
                        <IoCloudUploadOutline size={28} />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple
                        id="fileInput"
                        className="hidden"
                    />
                </div>

                {imagesAdded && (
                    <div className="flex justify-center items-center content-center flex-wrap flex-col gap-6 my-9">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-3">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="h-15 w-15 md:h-30 md:w-30  overflow-hidden rounded-md bg-gray-700"
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`uploaded-img-${index}`}
                                        className={"object-cover h-full w-full"}
                                        title={image.name}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <input
                                type="text"
                                className="px-2 py-1 mt-2 border border-[white] rounded bg-[#1c1a32a3] text-white"
                                placeholder="enter file name"
                                value={fileName}
                                onChange={handleFileName}
                            />
                        </div>
                        <button
                            className="px-4 py-2 flex bg-[#0f1127] rounded-md max-w-[200px] transition-all hover:scale-105
                            "
                            onClick={handleGeneratePdf}
                        >
                            Convert To PDF&nbsp;&nbsp;
                            <FaRegFilePdf size={20} />
                        </button>
                    </div>
                )}
            </div>
            <div className=" absolute text-[#8e8e8e] font-mono text-sm bottom-0 flex">
                <a
                    href="https://github.com/hasrku"
                    target="_blank"
                    className=" flex"
                >
                    <FaGithub fill="#8e8e8eb9" size={20} />
                    <span className="font-serif">&nbsp;@</span>hasrku
                </a>
            </div>
        </>
    );
};

export default App;
