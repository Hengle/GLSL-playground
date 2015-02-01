var HeightMap = Class.create();

HeightMap.prototype = {
    initialize : function(width, height, seed) {
        this.width = width;
        this.height = height;
        this.scene = new THREE.Scene();

        // create texture buffer
        var renderTargetParams = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat,
            generateMipmaps: false
        };
        this.texture = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParams);

        // Setup render-to-texture scene
        this.camera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 1000);
        this.scene.add(this.camera);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                seed: { type: "f", value: seed },
                uvScale: { type: "v2", value: new THREE.Vector2(1 / this.width, 1 / this.height) },
                offset: { type: "v2", value: new THREE.Vector2() }
            },
            vertexShader: document.getElementById('heightMapVertexShader').textContent,
            fragmentShader: document.getElementById('heightMapFragmentShader').textContent
        })

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            this.material
        );
        this.mesh.position.z = -100;
        this.scene.add(this.mesh);
    },

    getTexture: function() {
        return this.texture;
    },

    render: function(renderer, offsetX, offsetY) {
        this.material.uniforms['offset'].value = new THREE.Vector2(offsetX, offsetY);
        renderer.render(this.scene, this.camera, this.texture, true);
    }
};

