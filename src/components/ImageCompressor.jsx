import React, { useCallback, useEffect, useMemo, useState } from 'react'
import '../App.css'
import { GoArrowRight } from 'react-icons/go'
import { MdOutlineFileUpload } from 'react-icons/md'
import { debounce, getImageSize } from '../utils'
import { ImageCompare } from './ImageCompare'
const ImageCompressor = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [compressedImage, setCompressedImage] = useState()
    const [compression, setCompression] = useState(100)
    const [selectedFileSize, setSelectedFileSize] = useState(0)
    const [estimatedReducedSize, setEstimatedReducedSize] = useState(0)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setSelectedFile(file)
        setCompressedImage(null)

        if (file) {
            const fileSize = file.size
            setSelectedFileSize(fileSize)
            const originalSize = file.size
            const estimatedSize = originalSize * (compression / 100)
            setEstimatedReducedSize(estimatedSize.toFixed(2))
        } else {
            setSelectedFileSize(null)
        }
    }
    const handleCompressionChange = useCallback(
        debounce((e) => {
            const newCompression = parseInt(e.target.value, 10)
            const originalSize = selectedFile.size
            const estimatedSize = originalSize * (newCompression / 100)
            setEstimatedReducedSize(estimatedSize.toFixed(2))
        }, 100),
        [selectedFile, setEstimatedReducedSize, setCompression]
    )
    const compressImage = async () => {
        try {
            const formData = new FormData()
            formData.append('image', selectedFile)
            formData.append('resolution', compression * 10)
            const response = await fetch(
                `${process.env.REACT_APP_BACK_END_URL}/api/v1/compress`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            console.log({ response })
            if (!response.ok) {
                throw new Error('Failed to compress image')
            }
            const compressedImageBlob = await response.blob()
            setCompressedImage(compressedImageBlob)
        } catch (error) {
            console.error('Error compressing image:', error)
        }
    }
    const handleDownload = () => {
        const downloadLink = document.createElement('a')
        const url = URL.createObjectURL(compressedImage)
        downloadLink.href = url
        downloadLink.download = 'compressed_image.jpg' // Set desired file name
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const inputImageURL = useMemo(() => {
        if (selectedFile) {
            return URL.createObjectURL(selectedFile)
        }
    }, [selectedFile])

    const compressedImageURL = useMemo(() => {
        if (compressedImage) {
            return URL.createObjectURL(compressedImage)
        }
    }, [compressedImage])

    return (
        <div className="main_container">
            <div className="Compression_option_wrapper">
                <h2>Compression Options</h2>
                <div className="Resolution_wrapper">
                    <div>Resolution</div>
                    <select className="select_tag">
                        <option value="original">
                            Original (2500 X 1250 px)
                        </option>
                        <option value="small">Small (1000 X 500 px)</option>
                        <option value="medium">Medium (2000 X 1000 px)</option>
                        <option value="large">Large (3000 X 1500 px)</option>
                    </select>
                </div>
                <div className="Compression_wrapper">
                    <div className="Compression_header">
                        <div>Compression</div>
                        <div>{compression}%</div>
                    </div>
                    <div className="input_wrapper">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={compression}
                            onChange={(e) => {
                                const newCompression = parseInt(
                                    e.target.value,
                                    10
                                )
                                setCompression(newCompression)
                                handleCompressionChange(e)
                            }}
                        />
                    </div>
                </div>
                <div className="Estimated_size_wrapper">
                    <div className="Estimated_heading">
                        <div>Estimated</div>
                        <div>Reduced Size</div>
                        <div className="reduce_size">
                            Almost{' '}
                            {getImageSize(
                                selectedFileSize - estimatedReducedSize
                            )}{' '}
                            reduce
                        </div>
                    </div>
                    <div className="Estimated_sizeing">
                        <div className="current_size">
                            {getImageSize(estimatedReducedSize)}
                        </div>
                        <div className="orginal_size">
                            {getImageSize(selectedFileSize)}
                        </div>
                    </div>
                </div>
                <div className="compress_button" onClick={compressImage}>
                    <div>Compress File</div>
                    <GoArrowRight />
                </div>
            </div>
            {/* <div className="content_wrapper">
        <h2>Image Compressor</h2>
        <div className="Image_Input">
          <input type="file" onChange={handleFileChange} />
        </div>
        {selectedFile && (
          <div className="image_wrapper">
            <div className="selected_image">
              <h3>Selected Image:</h3>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                width="400"
              />
            </div>
            <div className="input_wrapper">
              <div>Resolution</div>
              <input
                type="number"
                placeholder="Enter Resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
              <div className="size_container">
                <div className="width_height">
                  <div>Width:</div>
                  <input
                    type="number"
                    placeholder="Enter Width"
                    value={width}
                    onChange={(e) => setwidth(e.target.value)}
                  />
                </div>
                <div className="width_height">
                  <div>Height:</div>
                  <input
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>
              <button onClick={compressImage}>Compress Image</button>
            </div>
            {compressedImage && (
              <div>
                <h3>Compressed Image:</h3>
                <img
                  src={URL.createObjectURL(compressedImage)}
                  alt="Compressed"
                  width="400"
                />
              </div>
            )}
          </div>
        )}
      </div> */}
            <div className="Image_wrapper">
                <div className="Image_container">
                    {inputImageURL&&compressedImageURL ? (
                        <ImageCompare
                            image1={inputImageURL}
                            image2={compressedImageURL}
                        />
                    ) : (
                        <div className="Image_Input">
                            <input type="file" onChange={handleFileChange} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImageCompressor
