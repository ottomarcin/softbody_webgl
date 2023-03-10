import { vec3 } from 'gl-matrix';

export default function objExporter(scene) {
  // exporting vertices, uvs, normals and indices of every object in the scene
  let verticesNumber = 0;
  let uvsNumber = 0;
  let normalsNumber = 0;
  let indicesNumber = 0;
  // text generated by exporter
  let output = '';
  // creating one vector3 to perform calculations
  let vector3 = vec3.create();
  // making sure every child is present in children array
  scene.mergeChildren();
  scene.children.forEach((child) => {
    // not saving box helping with positioning new objects
    if (child.name != 'Helper') {
      output += `o ${child.name} \n`;
      const { vertices, uv, normals, indices } = child.attributes;
      child.calculateModelToWorldMatrix();
      const modelToWorldMatrix = child.modelToWorldMatrix;
      //vertices
      for (
        let index = 0;
        index < vertices.data.length / vertices.elementsPerAttribute;
        index++
      ) {
        //   console.log(index);
        vec3.set(
          vector3,
          vertices.data[index * vertices.elementsPerAttribute + 0],
          vertices.data[index * vertices.elementsPerAttribute + 1],
          vertices.data[index * vertices.elementsPerAttribute + 2]
        );
        // applying transformations
        vec3.transformMat4(vector3, vector3, modelToWorldMatrix);
        output += `v ${vector3[0]} ${vector3[1]} ${vector3[2]} \n`;
      }
      // uvs
      for (
        let index = 0;
        index < uv.data.length / uv.elementsPerAttribute;
        index++
      ) {
        output += `vt ${uv.data[index * uv.elementsPerAttribute + 0]} ${
          uv.data[index * uv.elementsPerAttribute + 1]
        } \n`;
      }

      //normals
      for (
        let index = 0;
        index < normals.data.length / normals.elementsPerAttribute;
        index++
      ) {
        vec3.set(
          vector3,
          normals.data[index * normals.elementsPerAttribute + 0],
          normals.data[index * normals.elementsPerAttribute + 1],
          normals.data[index * normals.elementsPerAttribute + 2]
        );
        // applying transformations
        vec3.transformMat4(vector3, vector3, modelToWorldMatrix);
        vec3.normalize(vector3, vector3);
        output += `vn ${vector3[0]} ${vector3[1]} ${vector3[2]} \n`;
      }

      //indices
      for (
        let index = 0;
        index < indices.data.length / indices.elementsPerAttribute;
        index++
      ) {
        const retrievedIndices = [
          indices.data[index * indices.elementsPerAttribute + 0] + 1,
          indices.data[index * indices.elementsPerAttribute + 1] + 1,
          indices.data[index * indices.elementsPerAttribute + 2] + 1,
        ];
        //indices in obj starts with 1, so need to add 1
        output += `f ${verticesNumber + retrievedIndices[0]}/${
          uvsNumber + retrievedIndices[0]
        }/${normalsNumber + retrievedIndices[0]} ${
          verticesNumber + retrievedIndices[1]
        }/${uvsNumber + retrievedIndices[1]}/${
          normalsNumber + retrievedIndices[1]
        } ${verticesNumber + retrievedIndices[2]}/${
          uvsNumber + retrievedIndices[2]
        }/${normalsNumber + retrievedIndices[2]}  \n`;
      }
      //   updating quantity of each attribute
      verticesNumber += vertices.data.length / vertices.elementsPerAttribute;
      uvsNumber += uv.data.length / uv.elementsPerAttribute;
      normalsNumber += normals.data.length / normals.elementsPerAttribute;
      indicesNumber += indices.data.length / indices.elementsPerAttribute;
    }
  });

  // save it to file
  // https://javascript.info/blob
  let link = document.createElement('a');
  link.download = 'scene.obj';
  const blob = new Blob([output], { type: 'text/plain' });
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}
