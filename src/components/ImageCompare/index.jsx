import React, { useEffect, useRef, useState } from 'react'
import './index.css'
export const ImageCompare = ({ image1, image2 }) => {
    const overlayRef = useRef()
    const dividerRef = useRef()
    const [image1Loaded,setImage1Loaded] = useState(false);
    const [image2Loaded,setImage2Loaded] = useState(false);

    useEffect(() => {
        const cleanups = []
        function compareImages(img) {
            var slider,
                img,
                clicked = 0,
                w,
                h
            /*get the width and height of the img element*/
            w = img.offsetWidth
            h = img.offsetHeight
            /*set the width of the img element to 50%:*/
            img.style.width = w / 2 + 'px'
            /*create slider:*/
            slider =dividerRef.current;
            /*insert slider*/
            img.parentElement.insertBefore(slider, img)
            /*position the slider in the middle:*/
            slider.style.top = h / 2 - slider.offsetHeight / 2 + 'px'
            slider.style.left = w / 2 - slider.offsetWidth / 2 + 'px'
            /*execute a function when the mouse button is pressed:*/
            slider.addEventListener('mousedown', slideReady)
            cleanups.push([slider, 'mousedown', slideReady])
            /*and another function when the mouse button is released:*/
            window.addEventListener('mouseup', slideFinish)
            cleanups.push([slider,'mouseup', slideFinish])

            /*or touched (for touch screens:*/
            slider.addEventListener('touchstart', slideReady)
            cleanups.push([slider,'touchstart', slideReady])

            /*and released (for touch screens:*/
            window.addEventListener('touchend', slideFinish)
            cleanups.push([window,'touchend', slideFinish])

            function slideReady(e) {
                /*prevent any other actions that may occur when moving over the image:*/
                e.preventDefault()
                /*the slider is now clicked and ready to move:*/
                clicked = 1
                /*execute a function when the slider is moved:*/
                window.addEventListener('mousemove', slideMove)
                cleanups.push([window,'mousemove', slideMove])

                window.addEventListener('touchmove', slideMove)
                cleanups.push([window,'touchmove', slideMove])
            }
            function slideFinish() {
                /*the slider is no longer clicked:*/
                clicked = 0
            }
            function slideMove(e) {
                var pos
                /*if the slider is no longer clicked, exit this function:*/
                if (clicked == 0) return false
                /*get the cursor's x position:*/
                pos = getCursorPos(e)
                /*prevent the slider from being positioned outside the image:*/
                if (pos < 0) pos = 0
                if (pos > w) pos = w
                /*execute a function that will resize the overlay image according to the cursor:*/
                slide(pos)
            }
            function getCursorPos(e) {
                var a,
                    x = 0
                e = e.changedTouches ? e.changedTouches[0] : e
                /*get the x positions of the image:*/
                a = img.getBoundingClientRect()
                /*calculate the cursor's x coordinate, relative to the image:*/
                x = e.pageX - a.left
                /*consider any page scrolling:*/
                x = x - window.pageXOffset
                return x
            }
            function slide(x) {
                /*resize the image:*/
                img.style.width = x + 'px'
                /*position the slider:*/
                slider.style.left =
                    img.offsetWidth - slider.offsetWidth / 2 + 'px'
            }
        }
        if(image1Loaded && image2Loaded){
          compareImages(overlayRef.current)
        }

        return () => {
          cleanups.forEach(([doc, eventName,func])=>{
            doc.removeEventListener(eventName, func)
          })
        }
    }, [image1Loaded, image2Loaded])
    return (
        <div className="img-comp-container">
            <div className="img-comp-img">
                <img src={image1}  onLoad={()=>{setImage1Loaded(true)}}/>
            </div>
            <div className='img-comp-slider' ref={dividerRef}>

            </div>
            <div className="img-comp-img img-comp-overlay" ref={overlayRef}>
                <img src={image2} onLoad={()=>{setImage2Loaded(true)}}/>
            </div>
        </div>
    )
}
