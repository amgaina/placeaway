'use client'

import { useState } from 'react'
import Layout from '../components/layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Avid traveler and adventure seeker',
    avatar: '/placeholder.svg?height=100&width=100',
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsEditing(false)
    // Here you would typically send the updated user data to your backend
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input type="text" id="name" name="name" value={user.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" id="email" name="email" value={user.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <Textarea id="bio" name="bio" value={user.bio} onChange={handleInputChange} rows={4} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p>{user.bio}</p>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

