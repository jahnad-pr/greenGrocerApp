// export const removeBackground = async (imageBlob) => {
//   const formData = new FormData();
//   formData.append('image_file', imageBlob);
  
//   try {
//     const response = await fetch('https://api.remove.bg/v1.0/removebg', {
//       method: 'POST',
//       headers: {
//         'X-Api-Key': 'vkMEHxH4VY8qZTgqTG3EBhor',
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Failed to remove background');
//     }

//     const blob = await response.blob();
//     return blob;
//   } catch (error) {
//     console.error('Error removing background:', error);
//     throw error;
//   }
// };

export const removeBackgroundPhotoRoom = async (imageBlob) => {
  const formData = new FormData();
  formData.append('file', imageBlob);

  try {
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': '6feb44999cc2759b4eab702f7a756414abaaf2cd',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

