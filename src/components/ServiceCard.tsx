import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  status: 'active' | 'inactive';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
  status
}) => {
  const isActive = status === 'active';

  return (
    <Card className="service-card border shadow-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-find-red mb-4 text-4xl">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isActive ? 'Active' : 'Inactive - Coming Soon'}
        </span>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0">
        {isActive ? (
          <Button className="action-button w-full" asChild>
            <Link to={buttonLink}>{buttonText}</Link>
          </Button>
        ) : (
          <Button className="action-button w-full" disabled>
            Coming Soon
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
