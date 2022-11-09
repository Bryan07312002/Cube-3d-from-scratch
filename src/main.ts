interface Vec3d {
  x:number;
  y:number;
  z:number;
}

type Matrix4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
]

type Triangle = [Vec3d, Vec3d, Vec3d];

class Mesh {
  tris: Array<Triangle>;
  
  constructor (M: Array<Triangle>) {
    console.log(M)
    this.tris = M
  }
}

class Canvas {
  private mesh_cube: Mesh;

  public context?: CanvasRenderingContext2D;
  public plane_n: number;
  public render_distance: number;
  public fov: number;
  public fov_rad: number;
  public height: number = 0;
  public width: number = 0;
  public aspect_ratio: number; 
  public projection_matrix: Matrix4x4;
  
  constructor () {
    const canvas:HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas != null ) {
      this.height = canvas.height;
      this.width = canvas.width;

      let ctx: CanvasRenderingContext2D | null = null;
      ctx = canvas.getContext("2d");
      if (ctx == null) {
        console.log("Error") // TODO: Fazer tratamento de erro descente
      } else {
        this.context = ctx;
      }
    }
    this.plane_n = 0.1;
    this.render_distance = 10000;
    this.fov = 90;
    this.fov_rad = 1 / Math.tan(this.fov * 0.5 / 180 * 3.14159);
    this.aspect_ratio = this.height / this.width
    this.projection_matrix = [
      [this.aspect_ratio * this.fov_rad,0,0,0],
      [0,this.fov_rad,0,0],
      [0,0,this.render_distance/(this.render_distance - this.plane_n),1],
      [0,0,(- this.render_distance * this.plane_n)/(this.render_distance - this.plane_n),0],
    ] 
    this.mesh_cube = new Mesh([
      // South
      [{x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}],
      [{x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 0, z: 0}],
      // East
      [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 0}, {x: 1, y: 1, z: 1}],
      [{x: 1, y: 0, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 1}],
      // North
      [{x: 1, y: 0, z: 1}, {x: 1, y: 1, z: 1}, {x: 0, y: 1, z: 1}],
      [{x: 1, y: 0, z: 1}, {x: 0, y: 1, z: 1}, {x: 0, y: 0, z: 1}],
      // West
      [{x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 1}, {x: 0, y: 1, z: 0}],
      [{x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0}, {x: 0, y: 0, z: 0}],
      // Top
      [{x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 1}, {x: 1, y: 1, z: 1}],
      [{x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 1}, {x: 1, y: 0, z: 0}],
      // Bottom
      [{x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 1}, {x: 0, y: 0, z: 0}],
      [{x: 1, y: 0, z: 1}, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}],
    ]);

    console.log(this.mesh_cube);
  }

  onUpdate () {
    // Clear Canvas
    if (this.context === undefined) return
    this.context.clearRect(0, 0, window.screen.width , window.screen.height);

    if (this.mesh_cube == undefined) {
      console.error('Mesh is undefined')
      return
    }
    console.log(this.mesh_cube.tris);
    this.mesh_cube.tris.forEach(element => {
      let triangle:Triangle = [...element];
      console.log(triangle)
      this.multiply_matrix(element[0], triangle[0], this.projection_matrix);
      this.multiply_matrix(element[0], triangle[1], this.projection_matrix);
      this.multiply_matrix(element[0], triangle[2], this.projection_matrix);
      triangle[0].x += 1;
      triangle[0].y += 1;

      triangle[1].x += 1;
      triangle[1].y += 1;

      triangle[2].x += 1;
      triangle[2].y += 1;

      triangle[0].x *= .5 * this.width;
      triangle[0].y *= .5 * this.height;

      triangle[1].x *= .5 * this.width;
      triangle[1].y *= .5 * this.height;

      triangle[2].x *= .5 * this.width;
      triangle[2].y *= .5 * this.height;

      this.draw_triangle(triangle[0], triangle[1], triangle[2]);
    });
  }

  draw_triangle (t1: Vec3d, t2: Vec3d, t3: Vec3d) {
    if (this.mesh_cube == undefined || this.context == undefined) 
      return;
    
    //console.log(t1, t2);
    this.context.beginPath(); // Start a new path
    this.context.moveTo(t1.x, t1.y); // Move the pen to (30, 50)
    this.context.lineTo(t2.x, t2.y); // Draw a line to (150, 100)
    this.context.stroke(); // Render the pathconsole.log('Hello World');
    this.context.lineTo(t3.x, t3.y); // Draw a line to (150, 100)
    this.context.stroke(); // Render the pathconsole.log('Hello World');
  }

  multiply_matrix (vecx: Vec3d, vecy: Vec3d, m4: Matrix4x4) {
    vecy.x = vecx.x * m4[0][0] + vecx.y + m4[1][0] + vecx.z * m4[2][0] + m4[3][0]; 
    vecy.y = vecx.x * m4[0][1] + vecx.y + m4[1][1] + vecx.z * m4[2][1] + m4[3][1]; 
    vecy.z = vecx.x * m4[0][2] + vecx.y + m4[1][2] + vecx.z * m4[2][2] + m4[3][2]; 
    const w = vecx.x * m4[0][3] + vecx.y + m4[1][3] + vecx.z * m4[2][3] + m4[3][3];

    if (w != 0) {
      vecy.x = vecx.x/w
      vecy.y = vecx.y/w
      vecy.z = vecx.z/w
    }
  }
}

function main () {
  const canvas:Canvas = new Canvas();
  canvas.onUpdate();
  // canvas.context.beginPath(); // Start a new path
  // canvas.context.moveTo(0, 0); // Move the pen to (30, 50)
  // canvas.context.lineTo(1050, 1000); // Draw a line to (150, 100)
  // canvas.context.stroke(); // Render the pathconsole.log('Hello World');
}

main();