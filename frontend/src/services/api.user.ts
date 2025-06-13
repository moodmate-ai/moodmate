import api from './api';

// DTOs based on UserDTO.java
export interface UserRequestDTO {
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  name?: string;
}

export interface UserResponseDTO {
  userId: number;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface ProfileImageDTO {
  userId: number;
  image: string;
}

export const userApi = {
  // POST /api/v1/user/create
  createUser: async (userRequest: UserRequestDTO): Promise<UserResponseDTO> => {
    const response = await api.post('/user/create', userRequest);
    return response.data;
  },

  // GET /api/v1/user/searchid/{userId}
  getUserById: async (userId: number): Promise<UserResponseDTO> => {
    const response = await api.get(`/user/searchid/${userId}`);
    return response.data;
  },

  // GET /api/v1/user/searchemail/{email}
  getUserByEmail: async (email: string): Promise<UserResponseDTO> => {
    const response = await api.get(`/user/searchemail/${email}`);
    return response.data;
  },

  // GET /api/v1/user/searchuser/{username}
  getUserByUsername: async (username: string): Promise<UserResponseDTO> => {
    const response = await api.get(`/user/searchuser/${username}`);
    return response.data;
  },

  // GET /api/v1/user/checkusername/{username}
  checkUserByUsername: async (username: string): Promise<boolean> => {
    try {
      const response = await api.get(`/user/checkusername/${username}`);
      return response.status === 200; // User exists
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false; // User doesn't exist
      }
      throw error;
    }
  },

  // GET /api/v1/user/searchname/{name}
  getUserByName: async (name: string): Promise<UserResponseDTO[]> => {
    const response = await api.get(`/user/searchname/${name}`);
    return response.data;
  },

  // GET /api/v1/user/image
  getProfileImage: async (userId: number): Promise<ProfileImageDTO> => {
    const response = await api.get(`/user/image/${userId}`);
    return response.data;
  },

  // PUT /api/v1/user/update/{userId}
  updateUser: async (userId: number, userRequest: UserRequestDTO): Promise<UserResponseDTO> => {
    const response = await api.put(`/user/update/${userId}`, userRequest);
    return response.data;
  },

  updateProfileImage: async (imageRequest: ProfileImageDTO): Promise<ProfileImageDTO> => {
    const response = await api.put(`/user/updateimage`, imageRequest);
    return response.data;
  },

  // DELETE /api/v1/user/delete/{userId}
  deleteUser: async (userId: number): Promise<string> => {
    const response = await api.delete(`/user/delete/${userId}`);
    return response.data;
  },
};
