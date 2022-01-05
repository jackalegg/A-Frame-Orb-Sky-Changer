/*
 * Orb | Sky Changer components written by On_x0
 */

//Orb Expanding Process to reset Fuse Cursor and Disable current Orb Animations
AFRAME.registerComponent('orb-expanding',{
    init: function(){
        var sceneEl = document.querySelector('a-scene');
        var sky = document.querySelector('#sky');
        var orb1 = document.querySelector('#orb1');
        var orb2 = document.querySelector('#orb2');
        var orb3 = document.querySelector('#orb3');
        var orb4 = document.querySelector('#orb4');
        var orb5 = document.querySelector('#orb5');
        var orb6 = document.querySelector('#orb6');
        //Pause all Orb Orbits when hovering over any sphere or Expanding
        this.el.addEventListener('mouseenter', function(){
            let skyExpanding = sky.getAttribute('class');
            if (skyExpanding === "still"){
                orb1.emit('pauseAnim');
                orb2.emit('pauseAnim');
                orb3.emit('pauseAnim');
                orb4.emit('pauseAnim');
                orb5.emit('pauseAnim');
                orb6.emit('pauseAnim');
            }
        });
        //Resume all Orb Animations when not hovering over any sphere or Expanding
        this.el.addEventListener('mouseleave', function(){
            let skyExpanding = sky.getAttribute('class');
            if (skyExpanding === "still"){
                orb1.emit('resumeAnim');
                orb2.emit('resumeAnim');
                orb3.emit('resumeAnim');
                orb4.emit('resumeAnim');
                orb5.emit('resumeAnim');
                orb6.emit('resumeAnim');
            }
        });
        //Listen for Click Fuse on Orb
        this.el.addEventListener('click', function(){
            let currentOrb = this;
            let skySrc = sky.getAttribute('src');
            let centerSky = sceneEl.querySelector("#centerSky");
            let testBox = sceneEl.querySelector("#test-box");
            let currRotation = currentOrb.getAttribute('rotation');
            let currOrbParent = currentOrb.parentNode;
            let currParentRotation = currOrbParent.getAttribute('rotation');
            let orbSrc = currentOrb.getAttribute('src');
            let orbInfo = currentOrb.getAttribute('id');
            let orbParentSrc = currOrbParent.getAttribute('src');
            let mouse = sceneEl.querySelector("#mouseCursor");
            //Sky is not still, prevent Animations
            sky.classList.toggle('still');
            //Disable Clickable Class
            currentOrb.classList.toggle('clickable');
            // Reset Cursor Fuse
            mouse.emit('orbExpand');
            //Grab the original Orbs orientation
            sky.emit('orbRot', { rotation: currRotation});
            //Send signal to reset Orb's User-Orbit Rotation for Sky Animation
            centerSky.emit('resetOrbit', { rotation: currParentRotation});
            //Check which Orb is being selected to change Sky with
            setTimeout(function () {
                if (orbSrc === '#sky1-1k'){
                    sky.setAttribute('src','#sky1-2k');
                } else if (orbSrc === '#sky2-1k'){
                    sky.setAttribute('src','#sky2-2k');
                } else if (orbSrc === '#sky3-1k'){
                    sky.setAttribute('src','#sky3-2k');
                } else if (orbSrc === '#sky4-1k'){
                    sky.setAttribute('src','#sky4-2k');
                } else if (orbSrc === '#sky5-1k'){
                    sky.setAttribute('src','#sky5-2k');
                } else if (orbSrc === '#sky6-1k'){
                    sky.setAttribute('src','#sky6-2k');
                } else {
                    sky.setAttribute('src','#sky0');}
            }, 2000);
            //Reset currentOrb back to original position with Sky's previous src 
            //Wait till orbExpand / opacOut Animation is finished
            setTimeout(function () {
                    //Dynamically reset src to previous Sky src
                    currentOrb.setAttribute('src', skySrc);
                    //Reset Scale, Animation and Animate back into Existance
                    currentOrb.setAttribute('scale','0.1 0.1 0.1');
                    currentOrb.setAttribute('opacity','1');
                    currentOrb.emit('orbReset');
                    //Done Expanding, Sky is now still and allows Resuming
                    sky.classList.toggle('still');
                    currentOrb.emit('mouseleave');
                    //Delay last Orb's class clickable application to allow it to animate far enough away from initial click position
                    setTimeout(function () {
                        currentOrb.classList.toggle('clickable');
                    }, 3000);
            }, 4000);
        });
    }
});

//Animation for Sky Rotation to Orbs current Rotation
AFRAME.registerComponent('sky-fix',{
    init: function(){
        let sky = this.el;
        let rotateParams = {
            property: 'object3D.rotation.y',
            to: 0,
            dur: 500,
            delay: 1500,
            loop: 'false',
            dir: 'normal',
            easing:'linear',
            elasticity: 400,
            autoplay: 'false',
            enabled: 'true',
            startEvents: 'skyFix',
            };
        sky.setAttribute('animation__skyRotate', rotateParams);
        //Listen for Orb Click to obtain current Rotation
        sky.addEventListener('orbRot', function(event){
            sky.setAttribute('animation__skyRotate', 'to', event.detail.rotation.y);
            //Start Sky Rotation Animation
            sky.emit('skyFix');
        });
    }
});

//Animation for Sky's outer Orbit Rotation to Orbs current outer Orbit Rotation
AFRAME.registerComponent('center-sky-fix',{
    init: function(){
        let skyOrbit = this.el;
        //Listen for Orb Click to set Orbit Animation for Sky parent based on current
        skyOrbit.addEventListener('resetOrbit', function(event){
            skyOrbit.setAttribute('animation__matchOrbit', 'to', event.detail.rotation.y);
            skyOrbit.emit('resetOrbitAnim');
        });
    }
});

//Orbs Orbiting around user dynamic start Animation
AFRAME.registerComponent('orbit-user',{
    init: function(){
        let currentOrbParent = this.el;
        let currRotation = currentOrbParent.getAttribute('rotation');
        let rotateParams = {
            property: 'rotation',
            to: {
                y: currRotation.y + 360
            },
            dur: 54000,
            delay: 0,
            loop: 'true',
            dir: 'normal',
            easing:'linear',
            elasticity: 400,
            autoplay: 'true',
            enabled: 'true',
            pauseEvents: ['pauseAnim','click',],
            resumeEvents: 'resumeAnim',
            };
        currentOrbParent.setAttribute('animation__orbitUser', rotateParams);
    }
});